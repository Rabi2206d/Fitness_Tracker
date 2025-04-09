import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { format, startOfWeek, isWithinInterval } from 'date-fns';
import UserFooter from './footer';
import UserHeader from './header';

// Register Chart.js components
Chart.register(...registerables);

const WorkoutAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
  if (analyticsData) {
    console.log('Available Exercises:', analyticsData.exercises);
    console.log('Progress Chart Data Structure:', analyticsData.charts?.progress);
    console.log('Frequency Chart Data Structure:', analyticsData.charts?.frequency);
  }
}, [analyticsData]);

  // Fetch data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/workoutanalytics`, {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        });
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load analytics");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Filter data based on time range
  useEffect(() => {
    if (!analyticsData) return;

    const filterData = () => {
      const now = new Date();
      let startDate;

      switch (timeRange) {
        case 'week':
          startDate = startOfWeek(now);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default: // 'all'
          setFilteredData(analyticsData);
          return;
      }

      const endDate = new Date();

      const filtered = {
        ...analyticsData,
        recentWorkouts: (analyticsData.recentWorkouts || []).filter(workout => {
          try {
            const date = workout.date ? new Date(workout.date) : null;
            return date && isWithinInterval(date, { start: startDate, end: endDate });
          } catch {
            return false;
          }
        }),
        personalRecords: Object.fromEntries(
          Object.entries(analyticsData.personalRecords || {}).filter(([_, record]) => {
            try {
              const date = record.date ? new Date(record.date) : null;
              return date && isWithinInterval(date, { start: startDate, end: endDate });
            } catch {
              return false;
            }
          })
        )
      };

      setFilteredData(filtered);
    };

    filterData();
  }, [analyticsData, timeRange]);

  // Format date safely
  const formatDate = (dateString) => {
    try {
      const date = dateString ? new Date(dateString) : null;
      return date ? format(date, 'MMM d, yyyy') : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  // Calculate summary stats
  const calculateSummary = () => {
    const data = filteredData || analyticsData || {};
    const recentWorkouts = data.recentWorkouts || [];
    const personalRecords = data.personalRecords || {};

    // Total workouts and PRs
    const totalWorkouts = recentWorkouts.length;
    const totalPRs = Object.keys(personalRecords).length;

    // Calculate weekly frequency
    const weeklyFrequency = {};
    recentWorkouts.forEach(workout => {
      try {
        if (workout.date) {
          const date = new Date(workout.date);
          const week = format(startOfWeek(date), 'yyyy-MM-dd');
          weeklyFrequency[week] = (weeklyFrequency[week] || 0) + 1;
        }
      } catch (e) {
        console.error('Error processing workout date:', workout.date, e);
      }
    });
    
    const avgWeekly = Object.keys(weeklyFrequency).length > 0 
      ? (totalWorkouts / Object.keys(weeklyFrequency).length).toFixed(1)
      : '0.0';

    // Use backend-calculated favorite exercise
    const favExercise = data.summary?.favExercise || null;
    const favExercisePercent = data.summary?.favExercisePercent || 0;

    // Consistency score
    let consistency = 0;
    if (recentWorkouts.length > 1) {
      try {
        const firstWorkout = recentWorkouts[recentWorkouts.length - 1];
        const lastWorkout = recentWorkouts[0];
        
        const firstDate = firstWorkout.date ? new Date(firstWorkout.date) : null;
        const lastDate = lastWorkout.date ? new Date(lastWorkout.date) : null;
        
        if (firstDate && lastDate) {
          const totalWeeks = Math.ceil((lastDate - firstDate) / (7 * 24 * 60 * 60 * 1000)) || 1;
          consistency = Math.min(100, Math.round((Object.keys(weeklyFrequency).length / totalWeeks) * 100));
        }
      } catch (e) {
        console.error('Error calculating consistency:', e);
      }
    }

    return {
      totalWorkouts,
      totalPRs,
      avgWeekly,
      favExercise,
      favExercisePercent,
      consistency
    };
  };

  const summary = calculateSummary();

  // Prepare chart data
  const prepareProgressChart = () => {
    if (!selectedExercise) return null;
    
    const data = filteredData || analyticsData || {};
    const progressData = data.charts?.progress || {};
    
    const exerciseData = progressData.datasets?.find(ds => {
      const chartName = ds.label.toLowerCase().replace(/\s*\(.*?\)\s*/g, '');
      const selected = selectedExercise.toLowerCase();
      return chartName.includes(selected) || selected.includes(chartName);
    });
  
    if (!exerciseData || !progressData.labels) return null;
  
    const chartData = progressData.labels
      .map((date, index) => ({
        x: date,
        y: exerciseData.data[index]
      }))
      .filter(point => point.y != null);
  
    return chartData.length > 0 ? {
      labels: chartData.map(point => formatDate(point.x)),
      datasets: [{
        label: `${selectedExercise} Progress`,
        data: chartData.map(point => point.y),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    } : null;
  };

  const prepareFrequencyChart = () => {
    const data = filteredData || analyticsData || {};
    const frequencyData = data.charts?.frequency?.data || {};
  
    // Handle the specific structure you're receiving
    if (frequencyData.datasets?.[0]?.data && typeof frequencyData.datasets[0].data === 'object') {
      // Convert the object format { "2025-15": 3 } to arrays
      const weeks = Object.keys(frequencyData.datasets[0].data);
      const counts = Object.values(frequencyData.datasets[0].data);
  
      return {
        labels: weeks.map(week => {
          // Format as "Week 15, 2025" if in YYYY-WW format
          if (week.match(/^\d{4}-\d{1,2}$/)) {
            const [year, weekNum] = week.split('-');
            return `Week ${weekNum}, ${year}`;
          }
          return week;
        }),
        datasets: [{
          label: 'Workouts per Week',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
    }
  
    // Fallback if data structure is different
    return {
      labels: [],
      datasets: [{
        label: 'Workouts per Week',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  };

  const prepareCategoryChart = () => {
    const data = filteredData || analyticsData || {};
    const distributionData = data.charts?.distribution?.data || {};
    
    if (!distributionData.labels || !distributionData.datasets?.[0]?.data) return null;

    return {
      labels: distributionData.labels,
      datasets: [{
        data: distributionData.datasets[0].data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderWidth: 1
      }]
    };
  };

  const prepareVolumeChart = () => {
    const data = filteredData || analyticsData || {};
    const volumeData = data.charts?.volume || {};
    
    if (!volumeData.labels || !volumeData.datasets?.[0]?.data) return null;

    // Generate consistent colors for the same exercises
    const colors = {};
    volumeData.labels.forEach(label => {
      if (!colors[label]) {
        colors[label] = `rgba(${Math.floor(Math.random() * 205) + 50}, 
                         ${Math.floor(Math.random() * 205) + 50}, 
                         ${Math.floor(Math.random() * 205) + 50}, 0.7)`;
      }
    });

    return {
      labels: volumeData.labels,
      datasets: [{
        label: 'Training Volume',
        data: volumeData.datasets[0].data,
        backgroundColor: volumeData.labels.map(label => colors[label]),
        borderWidth: 1
      }]
    };
  };

  const progressChartData = prepareProgressChart();
  const frequencyChartData = prepareFrequencyChart();
  const categoryChartData = prepareCategoryChart();
  const volumeChartData = prepareVolumeChart();

  if (loading) return <div className="loading-spinner">Loading analytics...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!analyticsData || analyticsData.message) {
    return <div className="no-data">No workout data available</div>;
  }

  return (
    <>
      <UserHeader/>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <div className="h-100">
                  {/* Header Section */}
                  <div className="row mb-3 pb-1">
                    <div className="col-12">
                      <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                        <div className="flex-grow-1">
                          <h4 className="fs-16 mb-1">Workout Analytics Dashboard</h4>
                          <p className="text-muted mb-0">Track your fitness progress and performance</p>
                        </div>
                        <div className="mt-3 mt-lg-0">
                          <div className="row g-3 mb-0 align-items-center">
                            <div className="col-sm-auto">
                              <div className="input-group">
                                <select 
                                  className="form-select"
                                  value={timeRange}
                                  onChange={(e) => setTimeRange(e.target.value)}
                                >
                                  <option value="week">Last Week</option>
                                  <option value="month">Last Month</option>
                                  <option value="year">Last Year</option>
                                  <option value="all">All Time</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-auto">
                              <select
                                className="form-select"
                                value={selectedExercise || ''}
                                onChange={(e) => setSelectedExercise(e.target.value)}
                              >
                                <option value="">Select Exercise</option>
                                {(analyticsData.exercises || []).map((exercise, index) => (
                                  <option key={index} value={exercise}>
                                    {exercise}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="row">
                    {[
                      {
                        title: "Total Workouts",
                        value: summary.totalWorkouts,
                        change: summary.consistency,
                        icon: "bx bx-dumbbell",
                        color: "success",
                      },
                      {
                        title: "Personal Records",
                        value: summary.totalPRs,
                        change: summary.totalPRs,
                        icon: "bx bx-trophy",
                        color: "info",
                      },
                      {
                        title: "Avg Weekly",
                        value: summary.avgWeekly,
                        change: summary.consistency,
                        icon: "bx bx-trending-up",
                        color: "warning",
                      },
                      {
                        title: "Favorite Exercise",
                        value: summary.favExercise || "None",
                        change: summary.favExercisePercent,
                        icon: "bx bx-star",
                        color: "primary",
                      }
                    ].map((card, index) => (
                      <div key={index} className="col-xl-3 col-md-6">
                        <div className="card card-animate">
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 overflow-hidden">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                  {card.title}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <h5 className={`fs-14 mb-0 text-${card.color}`}>
                                  <i className={`ri-arrow-right-up-line fs-13 align-middle`}></i> 
                                  {card.change}%
                                </h5>
                              </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                              <div>
                                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                  {card.value}
                                </h4>
                              </div>
                              <div className="avatar-sm flex-shrink-0">
                                <span className={`avatar-title bg-${card.color}-subtle rounded fs-3`}>
                                  <i className={`${card.icon} text-${card.color}`}></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Main Charts Section */}
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="card">
                        <div className="card-header border-0 align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">Workout Progress</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {progressChartData ? (
                              <Line
  data={progressChartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} kg/lbs`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight (kg/lbs)'
        }
      },
      x: {
        type: 'category', // Changed from time to category since we're formatting dates manually
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  }}
/>
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">
                                  {selectedExercise ? 'No progress data available for this exercise' : 'Select an exercise to view progress'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="card card-height-100">
                        <div className="card-header align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">Workout Distribution</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '250px' }}>
                            {categoryChartData ? (
                              <Doughnut
                                data={categoryChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'right'
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No category data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Charts Section */}
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Workout Frequency</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {frequencyChartData ? (
                              <Bar
                                data={frequencyChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false
                                    }
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      ticks: {
                                        precision: 0
                                      }
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No frequency data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Training Volume</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {volumeChartData ? (
                              <Bar
                                data={volumeChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false
                                    }
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: true
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No volume data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Records Section */}
                  <div className="row" id="personal-records">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Personal Records</h4>
                        </div>
                        <div className="card-body">
                          {Object.keys(filteredData?.personalRecords || analyticsData?.personalRecords || {}).length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-striped table-nowrap align-middle mb-0">
                                <thead>
                                  <tr>
                                    <th scope="col">Exercise</th>
                                    <th scope="col">Weight</th>
                                    <th scope="col">Sets × Reps</th>
                                    <th scope="col">Date Achieved</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(filteredData?.personalRecords || analyticsData?.personalRecords || {}).map(([exercise, record]) => (
                                    <tr key={exercise}>
                                      <td className="text-capitalize">{exercise}</td>
                                      <td>
                                        <span className="fw-semibold">{record.weight} {record.unit || 'kg/lbs'}</span>
                                      </td>
                                      <td>{record.sets} × {record.reps}</td>
                                      <td>{formatDate(record.date)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted">No personal records available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Workouts Section */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Recent Workouts</h4>
                        </div>
                        <div className="card-body">
                          {(filteredData?.recentWorkouts || analyticsData?.recentWorkouts || []).length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-striped table-nowrap align-middle mb-0">
                                <thead>
                                  <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Exercises</th>
                                    <th scope="col">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(filteredData?.recentWorkouts || analyticsData?.recentWorkouts || []).map((workout) => (
                                    <tr key={workout.id || workout._id}>
                                      <td>{formatDate(workout.date)}</td>
                                      <td className="text-capitalize">{workout.category || 'N/A'}</td>
                                      <td>{workout.exerciseCount || workout.exercises?.length || 0}</td>
                                      <td>
                                        <a href="/workout" className="btn btn-sm btn-soft-primary">View Details</a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted">No recent workouts available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserFooter/>
    </>
  );
};

export default WorkoutAnalytics;