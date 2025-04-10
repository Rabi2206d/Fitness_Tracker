import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { format, subDays, startOfWeek, isWithinInterval } from 'date-fns';
import UserFooter from './footer';
import UserHeader from './header';

// Register Chart.js components
Chart.register(...registerables);

const ProgressAnalytics = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('weight');

  // Fetch progress data from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await axios.get('http://localhost:4000/api/getprogress', {
          headers: {
            'auth-token': token
          }
        });
        setProgressData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load progress data");
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // Filter data based on time range
  const filteredData = progressData.filter(entry => {
    const entryDate = new Date(entry.date || entry.createdAt);
    let startDate, endDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(new Date());
        break;
      case 'month':
        startDate = subDays(new Date(), 30);
        break;
      case 'year':
        startDate = subDays(new Date(), 365);
        break;
      default: // 'all'
        return true;
    }

    return isWithinInterval(entryDate, { start: startDate, end: endDate });
  });

  // Format date
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
    if (filteredData.length === 0) return {};

    // Latest weight data
    const latestWeight = filteredData[filteredData.length - 1]?.weight;
    const firstWeight = filteredData[0]?.weight;
    const weightChange = latestWeight && firstWeight ? ((latestWeight - firstWeight) / firstWeight * 100).toFixed(1) : 0;

    // Performance improvements
    const latestRunTime = filteredData[filteredData.length - 1]?.performance?.runTime;
    const firstRunTime = filteredData[0]?.performance?.runTime;
    const runTimeChange = latestRunTime && firstRunTime ? ((firstRunTime - latestRunTime) / firstRunTime * 100).toFixed(1) : 0;

    // Measurement changes (waist as example)
    const latestWaist = filteredData[filteredData.length - 1]?.measurements?.waist;
    const firstWaist = filteredData[0]?.measurements?.waist;
    const waistChange = latestWaist && firstWaist ? ((firstWaist - latestWaist) / firstWaist * 100).toFixed(1) : 0;

    return {
      latestWeight,
      weightChange,
      latestRunTime,
      runTimeChange,
      latestWaist,
      waistChange,
      totalEntries: filteredData.length
    };
  };

  const summary = calculateSummary();

  // Prepare chart data
  const prepareChartData = (type) => {
    const labels = filteredData.map(entry => formatDate(entry.date || entry.createdAt));
    
    if (type === 'weight') {
      return {
        labels,
        datasets: [
          {
            label: 'Weight (kg)',
            data: filteredData.map(entry => entry.weight),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
          },
        ],
      };
    }

    if (type === 'measurements') {
      return {
        labels,
        datasets: [
          {
            label: 'Chest (cm)',
            data: filteredData.map(entry => entry.measurements.chest),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Waist (cm)',
            data: filteredData.map(entry => entry.measurements.waist),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
          {
            label: 'Hips (cm)',
            data: filteredData.map(entry => entry.measurements.hips),
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
          },
        ],
      };
    }

    if (type === 'performance') {
      return {
        labels,
        datasets: [
          {
            label: 'Run Time (seconds)',
            data: filteredData.map(entry => entry.performance.runTime),
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            yAxisID: 'y',
          },
          {
            label: 'Max Lift (kg)',
            data: filteredData.map(entry => entry.performance.maxLift),
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            yAxisID: 'y1',
          },
        ],
      };
    }
  };

  const chartOptions = (type) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}`;
            }
          }
        }
      },
    };

    if (type === 'performance') {
      return {
        ...baseOptions,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Run Time (seconds)',
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Max Lift (kg)',
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      };
    }

    return baseOptions;
  };

  if (loading) return <div className="loading-spinner">Loading progress data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <>
      <UserHeader />
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
                          <h4 className="fs-16 mb-1">Fitness Progress Dashboard</h4>
                          <p className="text-muted mb-0">Track your fitness metrics and measurements</p>
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
                        title: "Current Weight",
                        value: summary.latestWeight ? `${summary.latestWeight} kg` : 'N/A',
                        change: summary.weightChange,
                        icon: "bx bx-body",
                        color: "success",
                        trend: summary.weightChange >= 0 ? "up" : "down"
                      },
                      {
                        title: "Run Time",
                        value: summary.latestRunTime ? `${summary.latestRunTime} sec` : 'N/A',
                        change: summary.runTimeChange,
                        icon: "bx bx-run",
                        color: "info",
                        trend: summary.runTimeChange >= 0 ? "down" : "up"
                      },
                      {
                        title: "Waist Measurement",
                        value: summary.latestWaist ? `${summary.latestWaist} cm` : 'N/A',
                        change: summary.waistChange,
                        icon: "bx bx-ruler",
                        color: "warning",
                        trend: summary.waistChange >= 0 ? "down" : "up"
                      },
                      {
                        title: "Total Entries",
                        value: summary.totalEntries || 0,
                        change: "",
                        icon: "bx bx-data",
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
                              {card.change && (
                                <div className="flex-shrink-0">
                                  <h5 className={`fs-14 mb-0 text-${card.trend === 'up' ? 'success' : 'danger'}`}>
                                    <i className={`ri-arrow-right-${card.trend}-line fs-13 align-middle`}></i> 
                                    {card.change}%
                                  </h5>
                                </div>
                              )}
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

                  {/* Tabs and Main Chart */}
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header border-0 align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">Progress Tracking</h4>
                          <div className="d-flex gap-1">
                            <button
                              className={`btn btn-soft-${activeTab === 'weight' ? 'primary' : 'secondary'} btn-sm`}
                              onClick={() => setActiveTab('weight')}
                            >
                              Weight
                            </button>
                            <button
                              className={`btn btn-soft-${activeTab === 'measurements' ? 'primary' : 'secondary'} btn-sm`}
                              onClick={() => setActiveTab('measurements')}
                            >
                              Measurements
                            </button>
                            <button
                              className={`btn btn-soft-${activeTab === 'performance' ? 'primary' : 'secondary'} btn-sm`}
                              onClick={() => setActiveTab('performance')}
                            >
                              Performance
                            </button>
                          </div>
                        </div>
                        <div className="card-body">
                          <div style={{ height: '350px' }}>
                            {filteredData.length > 0 ? (
                              <Line
                                data={prepareChartData(activeTab)}
                                options={chartOptions(activeTab)}
                              />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <p className="text-muted">No data available for the selected time range</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Entries Table */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title mb-0">Progress History</h4>
                        </div>
                        <div className="card-body">
                          {filteredData.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-striped table-nowrap align-middle mb-0">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Weight (kg)</th>
                                    <th>Waist (cm)</th>
                                    <th>Chest (cm)</th>
                                    <th>Run Time (s)</th>
                                    <th>Max Lift (kg)</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredData.map((entry, index) => (
                                    <tr key={index}>
                                      <td>{formatDate(entry.date || entry.createdAt)}</td>
                                      <td>{entry.weight}</td>
                                      <td>{entry.measurements.waist}</td>
                                      <td>{entry.measurements.chest}</td>
                                      <td>{entry.performance.runTime}</td>
                                      <td>{entry.performance.maxLift}</td>
                                      <td>
                                        <a href="/progress" className="btn btn-sm btn-soft-primary">
                                          Details
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted">No progress entries available</p>
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
      <UserFooter />
    </>
  );
};

export default ProgressAnalytics;