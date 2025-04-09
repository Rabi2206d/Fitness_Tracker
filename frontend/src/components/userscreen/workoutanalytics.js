// WorkoutAnalytics.jsx
// import React, { useEffect, useState } from 'react';
// import { Bar, Line, Doughnut } from 'react-chartjs-2';
// import axios from 'axios';
// import { Chart, registerables } from 'chart.js';
// import UserFooter from './footer';
// import UserHeader from './header';
// Chart.register(...registerables);

// const WorkoutAnalytics = () => {
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/workoutanalytics', {
//           headers: {
//             'auth-token': localStorage.getItem('auth-token')
//           }
//         });
//         setAnalyticsData(response.data);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch analytics');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, []);

//   if (loading) return <div>Loading analytics...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!analyticsData) return <div>No data available</div>;

//   return (
//     <>
//     <UserHeader/>
//     <div className="workout-analytics">
//       <h2>Workout Analytics</h2>
      
//       <div className="analytics-section">
//         <h3>Workout Frequency</h3>
//         <div className="chart-row">
//           <div className="chart-container">
//             <h4>By Day of Week</h4>
//             <Bar data={analyticsData.frequency.byDay.data} />
//           </div>
//           <div className="chart-container">
//             <h4>By Week</h4>
//             <Line data={analyticsData.frequency.byWeek.data} />
//           </div>
//           <div className="chart-container">
//             <h4>By Month</h4>
//             <Bar data={analyticsData.frequency.byMonth.data} />
//           </div>
//         </div>
//         <div className="stats">
//           <p>Total Workouts: {analyticsData.frequency.totalWorkouts}</p>
//           <p>Average per Week: {analyticsData.frequency.averagePerWeek}</p>
//         </div>
//       </div>
      
//       <div className="analytics-section">
//         <h3>Category Distribution</h3>
//         <div className="chart-container" style={{ width: '300px', margin: '0 auto' }}>
//           <Doughnut data={analyticsData.categoryDistribution.data} />
//         </div>
//       </div>
      
//       <div className="analytics-section">
//         <h3>Strength Progress</h3>
//         {Object.keys(analyticsData.strengthProgress).map(exercise => (
//           <div key={exercise} className="exercise-progress">
//             <h4>{exercise}</h4>
//             <div className="chart-row">
//               <div className="chart-container">
//                 <h5>Weight Progress</h5>
//                 <Line data={analyticsData.strengthProgress[exercise].weightProgress.data} />
//                 <p>PR: {analyticsData.strengthProgress[exercise].maxWeight} kg/lbs</p>
//               </div>
//               <div className="chart-container">
//                 <h5>Volume Progress</h5>
//                 <Line data={analyticsData.strengthProgress[exercise].volumeProgress.data} />
//                 <p>Max Volume: {analyticsData.strengthProgress[exercise].maxVolume}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="analytics-section">
//         <h3>Personal Records</h3>
//         <div className="pr-grid">
//           {Object.keys(analyticsData.personalRecords).map(exercise => (
//             <div key={exercise} className="pr-card">
//               <h4>{exercise}</h4>
//               <p>Weight: {analyticsData.personalRecords[exercise].weight} kg/lbs</p>
//               <p>Sets: {analyticsData.personalRecords[exercise].sets}</p>
//               <p>Reps: {analyticsData.personalRecords[exercise].reps}</p>
//               <p>Date: {new Date(analyticsData.personalRecords[exercise].date).toLocaleDateString()}</p>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="analytics-section">
//         <h3>Recent Workouts</h3>
//         <ul className="recent-workouts">
//           {analyticsData.recentWorkouts.map(workout => (
//             <li key={workout.id}>
//               {new Date(workout.date).toLocaleDateString()} - {workout.category} 
//               ({workout.exerciseCount} exercises)
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//     <UserFooter/>
//     </>
//   );
// };

// export default WorkoutAnalytics;