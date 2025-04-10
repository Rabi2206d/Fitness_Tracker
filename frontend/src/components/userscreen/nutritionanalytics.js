import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import UserFooter from './footer';
import UserHeader from './header';

// Register Chart.js components
Chart.register(...registerables);

const NutritionAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  // Fetch data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/nutritionanalytics?range=${timeRange}`, {
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
  }, [timeRange]);

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return dateString ? format(parseISO(dateString), 'MMM d, yyyy') : 'N/A';
    } catch {
      return dateString || 'N/A';
    }
  };

  // Prepare chart data
  const prepareCalorieTrendChart = () => {
    if (!analyticsData?.dailyTrends?.length) return null;

    return {
      labels: analyticsData.dailyTrends.map(day => formatDate(day.date)),
      datasets: [{
        label: 'Calories',
        data: analyticsData.dailyTrends.map(day => day.calories),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }]
    };
  };

  const prepareMacroTrendChart = () => {
    if (!analyticsData?.dailyTrends?.length) return null;

    return {
      labels: analyticsData.dailyTrends.map(day => formatDate(day.date)),
      datasets: [
        {
          label: 'Protein',
          data: analyticsData.dailyTrends.map(day => day.protein),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1
        },
        {
          label: 'Carbs',
          data: analyticsData.dailyTrends.map(day => day.carbs),
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          tension: 0.1
        },
        {
          label: 'Fat',
          data: analyticsData.dailyTrends.map(day => day.fat),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
  };

  const prepareMealDistributionChart = () => {
    if (!analyticsData?.mealDistribution) return null;

    const mealData = analyticsData.mealDistribution;
    const labels = Object.keys(mealData);
    
    return {
      labels,
      datasets: [
        {
          label: 'Calories',
          data: labels.map(meal => mealData[meal].calories),
          backgroundColor: 'rgba(255, 99, 132, 0.7)'
        },
        {
          label: 'Protein',
          data: labels.map(meal => mealData[meal].protein),
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        },
        {
          label: 'Carbs',
          data: labels.map(meal => mealData[meal].carbs),
          backgroundColor: 'rgba(255, 206, 86, 0.7)'
        },
        {
          label: 'Fat',
          data: labels.map(meal => mealData[meal].fat),
          backgroundColor: 'rgba(75, 192, 192, 0.7)'
        }
      ]
    };
  };

  const prepareMacroDistributionChart = () => {
    if (!analyticsData?.macroDistribution) return null;

    return {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [{
        data: [
          analyticsData.macroDistribution.protein,
          analyticsData.macroDistribution.carbs,
          analyticsData.macroDistribution.fat
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderWidth: 1
      }]
    };
  };

  const prepareTopFoodsChart = () => {
    if (!analyticsData?.topFoods?.length) return null;

    return {
      labels: analyticsData.topFoods.map(food => food.name),
      datasets: [{
        label: 'Times Consumed',
        data: analyticsData.topFoods.map(food => food.count),
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

  const calorieTrendChartData = prepareCalorieTrendChart();
  const macroTrendChartData = prepareMacroTrendChart();
  const mealDistributionChartData = prepareMealDistributionChart();
  const macroDistributionChartData = prepareMacroDistributionChart();
  const topFoodsChartData = prepareTopFoodsChart();

  if (loading) return <div className="loading-spinner">Loading analytics...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!analyticsData) return <div className="no-data">No nutrition data available</div>;

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
                          <h4 className="fs-16 mb-1">Nutrition Analytics Dashboard</h4>
                          <p className="text-muted mb-0">Track your nutrition intake and patterns</p>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="row">
                    {[
                      {
                        title: "Total Calories",
                        value: analyticsData.summary.totalCalories.toFixed(0),
                        unit: "kcal",
                        icon: "bx bx-calendar",
                        color: "success"
                      },
                      {
                        title: "Protein",
                        value: analyticsData.summary.totalProtein.toFixed(0),
                        unit: "g",
                        icon: "bx bx-dumbbell",
                        color: "info"
                      },
                      {
                        title: "Carbs",
                        value: analyticsData.summary.totalCarbs.toFixed(0),
                        unit: "g",
                        icon: "bx bx-baguette",
                        color: "warning"
                      },
                      {
                        title: "Fat",
                        value: analyticsData.summary.totalFat.toFixed(0),
                        unit: "g",
                        icon: "bx bx-water",
                        color: "primary"
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
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                              <div>
                                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                  {card.value} <small className="fs-14 text-muted">{card.unit}</small>
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
                          <h4 className="card-title mb-0 flex-grow-1">Calorie Intake Trend</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {calorieTrendChartData ? (
                              <Line
                                data={calorieTrendChartData}
                                options={{
                                  responsive: true,
                                  plugins: {
                                    legend: {
                                      display: false
                                    }
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: false,
                                      title: {
                                        display: true,
                                        text: 'Calories (kcal)'
                                      }
                                    },
                                    x: {
                                      title: {
                                        display: true,
                                        text: 'Date'
                                      }
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No calorie data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="card card-height-100">
                        <div className="card-header align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">Macronutrient Distribution</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '250px' }}>
                            {macroDistributionChartData ? (
                              <Doughnut
                                data={macroDistributionChartData}
                                options={{
                                  responsive: true,
                                  plugins: {
                                    legend: {
                                      position: 'right'
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function(context) {
                                          return `${context.label}: ${context.raw.toFixed(1)}%`;
                                        }
                                      }
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No macro data available</p>
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
                          <h4 className="card-title mb-0">Macronutrient Trends</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {macroTrendChartData ? (
                              <Line
                                data={macroTrendChartData}
                                options={{
                                  responsive: true,
                                  plugins: {
                                    legend: {
                                      position: 'top'
                                    }
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: false,
                                      title: {
                                        display: true,
                                        text: 'Grams (g)'
                                      }
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No macro trend data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Meal Distribution</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {mealDistributionChartData ? (
                              <Bar
                                data={mealDistributionChartData}
                                options={{
                                  responsive: true,
                                  plugins: {
                                    legend: {
                                      position: 'top'
                                    }
                                  },
                                  scales: {
                                    x: {
                                      stacked: true
                                    },
                                    y: {
                                      stacked: true
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No meal distribution data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Chart Types */}
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Top Consumed Foods</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {topFoodsChartData ? (
                              <Bar
                                data={topFoodsChartData}
                                options={{
                                  responsive: true,
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
                                <p className="text-muted">No food consumption data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Meal Type Distribution</h4>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '300px' }}>
                            {macroDistributionChartData ? (
                              <Pie
                                data={macroDistributionChartData}
                                options={{
                                  responsive: true,
                                  plugins: {
                                    legend: {
                                      position: 'right'
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function(context) {
                                          return `${context.label}: ${context.raw.toFixed(1)}%`;
                                        }
                                      }
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No meal type data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Meals Section */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Recent Meals</h4>
                        </div>
                        <div className="card-body">
                          {analyticsData.recentMeals.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-striped table-nowrap align-middle mb-0">
                                <thead>
                                  <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Meals</th>
                                    <th scope="col">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {analyticsData.recentMeals.map((mealEntry, index) => (
                                    <tr key={index}>
                                      <td>{formatDate(mealEntry.date)}</td>
                                      <td>
                                        {mealEntry.meals.map((meal, i) => (
                                          <span key={i} className="badge bg-primary me-1">
                                            {meal.type}: {meal.items.join(', ')}
                                          </span>
                                        ))}
                                      </td>
                                      <td>
                                        <a 
                                          className="btn btn-sm btn-soft-primary"
                                          href="/nutrition"
                                        >
                                          View Details
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted">No recent meals available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Foods Section */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Top Consumed Foods</h4>
                        </div>
                        <div className="card-body">
                          {analyticsData.topFoods.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-striped table-nowrap align-middle mb-0">
                                <thead>
                                  <tr>
                                    <th scope="col">Food</th>
                                    <th scope="col">Times Consumed</th>
                                    <th scope="col">Avg Calories</th>
                                    <th scope="col">Avg Protein</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {analyticsData.topFoods.map((food, index) => (
                                    <tr key={index}>
                                      <td className="text-capitalize">{food.name}</td>
                                      <td>{food.count}</td>
                                      <td>{food.avgCalories.toFixed(0)} kcal</td>
                                      <td>{food.avgProtein.toFixed(1)} g</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted">No food consumption data available</p>
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

export default NutritionAnalytics;