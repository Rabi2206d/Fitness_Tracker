import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import workdata from '../Models/workout.js';
const workoutrouter = express.Router();

// Get Workout Details
workoutrouter.get("/getworkoutdetails" , fetchUser , async (req , res)=>{
    try {
        const workout = await workdata.find({user : req.userid})
        res.status(200).json(workout);
    } catch (error) {
       res.status(500).json({error : "Internal Server Error"});
    }
})

// Add Workout
workoutrouter.post("/addworkout" , fetchUser , async (req , res)=>{
    const { exercises, category, tags } = req.body;
    try {
       if(!exercises || !category || !tags){
        return res.status(400).json({error : "All fields are required"});
       }

       const workout = new workdata({
        user: req.userid,
        exercises,
        category,
        tags,
       })
       const saveWorkout = await workout.save();
       res.status(200).json(saveWorkout);
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
})

// Delete Workouts
workoutrouter.delete("/deleteworkout/:id", fetchUser, async (req, res) => {
    const workoutid  = req.params.id;

    try {
        const workout  = await workdata.findById(workoutid);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        if (workout.user.toString() !== req.userid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await workdata.findByIdAndDelete(workoutid);
        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update Workouts
workoutrouter.put("/updateworkout/:id", fetchUser, async (req, res) => {
    const workoutid  = req.params.id;

    try {
        const workout = await workdata.findById(workoutid);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
    
        if (workout.user.toString() !== req.userid) {
            return res.status(403).json({ error: "Unauthorized" });
        }
    
        Object.assign(workout, req.body);
        const updatedWorkout = await workout.save(); 
        res.status(200).json(updatedWorkout);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Internal Server Error" });
    }
   

});


workoutrouter.get("/workoutanalytics", fetchUser, async (req, res) => {
  try {
    const userId = req.userid;
    
    // Get all workouts for the user
    const workouts = await workdata.find({ user: userId })
      .sort({ date: 1 })
      .lean(); // Using lean() for better performance with large datasets
    
      if (!workouts || workouts.length === 0) {
          return res.status(200).json({ 
            summary: {
              totalWorkouts: 0,
              totalPRs: 0,
              avgWeekly: 0,
              favExercise: null,
              favExercisePercent: 0,
              workoutTrend: 0,
              prTrend: 0,
              consistency: 0
            },
            charts: {},
            personalRecords: {},
            recentWorkouts: [],
            exercises: [],
            message: "No workout data found" 
          });
        }
    
    // Prepare analytics data
    const frequency = calculateWorkoutFrequency(workouts);
    const strengthProgress = calculateStrengthProgress(workouts);
    const categoryDistribution = getCategoryDistribution(workouts);
    const recentWorkouts = getRecentWorkouts(workouts);
    const personalRecords = calculatePersonalRecords(workouts);
    
    // Get all unique exercise names
    const exercises = [...new Set(
      workouts.flatMap(workout =>
        workout.exercises.map(ex => ex.name)
      )
    )].filter(Boolean);
    
    // Find favorite exercise
    const exerciseCounts = {};
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (ex.name) {
          exerciseCounts[ex.name] = (exerciseCounts[ex.name] || 0) + 1;
        }
      });
    });
    
    const favExercise = Object.keys(exerciseCounts).reduce((a, b) => 
      exerciseCounts[a] > exerciseCounts[b] ? a : b, null);
    
    const favExercisePercent = favExercise ? 
      Math.round((exerciseCounts[favExercise] / workouts.length) * 100) : 0;
    
    // Prepare the response
    const analyticsData = {
      summary: {
        totalWorkouts: workouts.length,
        totalPRs: Object.keys(personalRecords).length,
        avgWeekly: parseFloat(frequency.averagePerWeek),
        favExercise,
        favExercisePercent,
        workoutTrend: 10, // Placeholder - you should calculate this based on previous period
        prTrend: 5,       // Placeholder - you should calculate this based on previous period
        consistency: Math.min(100, Math.round((workouts.length / 30) * 100)) // Example calculation
      },
      charts: {
        progress: formatProgressChart(strengthProgress),
        distribution: categoryDistribution,
        frequency: frequency.byWeek,
        volume: formatVolumeChart(strengthProgress)
      },
      personalRecords,
      recentWorkouts,
      exercises
    };
    
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Helper functions for analytics
function calculateWorkoutFrequency(workouts) {
  const frequencyData = {
    byDay: {},
    byWeek: {},
    byMonth: {}
  };
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Initialize frequency data
  daysOfWeek.forEach(day => {
    frequencyData.byDay[day] = 0;
  });
  
  // Process each workout
  workouts.forEach(workout => {
    const date = new Date(workout.date);
    
    // By day of week
    const day = daysOfWeek[date.getDay()];
    frequencyData.byDay[day]++;
    
    // By week (year-week format)
    const week = `${date.getFullYear()}-${getWeekNumber(date)}`;
    frequencyData.byWeek[week] = (frequencyData.byWeek[week] || 0) + 1;
    
    // By month (year-month format)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    frequencyData.byMonth[month] = (frequencyData.byMonth[month] || 0) + 1;
  });
  
  return {
    byDay: formatForChart(daysOfWeek, frequencyData.byDay, 'Workouts per day'),
    byWeek: formatForChart(
      Object.keys(frequencyData.byWeek).sort(),
      frequencyData.byWeek,
      'Workouts per week'
    ),
    byMonth: formatForChart(
      Object.keys(frequencyData.byMonth).sort(),
      frequencyData.byMonth,
      'Workouts per month'
    ),
    totalWorkouts: workouts.length,
    averagePerWeek: (workouts.length / (Object.keys(frequencyData.byWeek).length || 1)).toFixed(1)
  };
}

function calculateStrengthProgress(workouts) {
  const progressData = {};
  
  // Filter only strength workouts
  const strengthWorkouts = workouts.filter(w => w.category === 'strength');
  
  strengthWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
          if (exercise.weight && exercise.name) {
              if (!progressData[exercise.name]) {
                  progressData[exercise.name] = {
                      dates: [],
                      weights: [],
                      volumes: [],
                      maxWeight: 0,
                      maxVolume: 0
                  };
              }
              
              const dateStr = new Date(workout.date).toISOString().split('T')[0];
              const volume = exercise.sets * exercise.reps * exercise.weight;
              
              progressData[exercise.name].dates.push(dateStr);
              progressData[exercise.name].weights.push(exercise.weight);
              progressData[exercise.name].volumes.push(volume);
              
              // Update max records
              progressData[exercise.name].maxWeight = Math.max(
                  progressData[exercise.name].maxWeight, 
                  exercise.weight
              );
              progressData[exercise.name].maxVolume = Math.max(
                  progressData[exercise.name].maxVolume, 
                  volume
              );
          }
      });
  });
  
  return progressData;
}

function getCategoryDistribution(workouts) {
  const distribution = {
    strength: 0,
    cardio: 0,
    flexibility: 0,
    balance: 0
  };
  
  workouts.forEach(workout => {
    if (distribution.hasOwnProperty(workout.category)) {
      distribution[workout.category]++;
    }
  });
  
  return formatForChart(
    Object.keys(distribution),
    Object.values(distribution),
    'Workouts by category',
    'doughnut'
  );
}

function getRecentWorkouts(workouts, limit = 5) {
  return workouts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
    .map(workout => ({
      id: workout._id,
      date: workout.date,
      category: workout.category,
      exerciseCount: workout.exercises.length,
      duration: workout.duration
    }));
}

function calculatePersonalRecords(workouts) {
  const prs = {};
  
  const strengthWorkouts = workouts.filter(w => w.category === 'strength');
  
  strengthWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.weight && exercise.name) {
        if (!prs[exercise.name] || exercise.weight > prs[exercise.name].weight) {
          prs[exercise.name] = {
            weight: exercise.weight,
            sets: exercise.sets,
            reps: exercise.reps,
            date: workout.date,
            workoutId: workout._id
          };
        }
      }
    });
  });
  
  return prs;
}

// Utility functions
function formatForChart(labels, data, label, chartType = 'bar') {
  return {
    chartType,
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: getBackgroundColor(chartType),
        borderColor: getBorderColor(chartType),
        borderWidth: 1
      }]
    }
  };
}

function formatProgressChart(progressData) {
  const datasets = [];
  const allDates = new Set();

  // Collect all unique dates
  Object.values(progressData).forEach(exercise => {
    exercise.dates.forEach(date => allDates.add(date));
  });

  const sortedDates = Array.from(allDates).sort();

  // Create datasets for each exercise
  Object.entries(progressData).forEach(([exerciseName, exerciseData]) => {
    const exercisePoints = new Array(sortedDates.length).fill(null);
    
    exerciseData.dates.forEach((date, index) => {
      const dateIndex = sortedDates.indexOf(date);
      if (dateIndex !== -1) {
        exercisePoints[dateIndex] = exerciseData.weights[index];
      }
    });

    datasets.push({
      label: `${exerciseName} (Weight)`,
      data: exercisePoints,
      borderColor: getRandomColor(),
      backgroundColor: 'transparent',
      tension: 0.1
    });
  });

  return {
    labels: sortedDates,
    datasets: datasets
  };
}

function formatVolumeChart(progressData) {
  if (!progressData || typeof progressData !== 'object') {
      return {
          labels: [],
          datasets: [{
              label: 'Total Volume',
              data: [],
              backgroundColor: [],
              borderWidth: 1
          }]
      };
  }

  const exerciseNames = Object.keys(progressData);
  const volumes = exerciseNames.map(ex => {
      const data = progressData[ex];
      // Check if volumes exists and is an array before calling reduce
      if (data && Array.isArray(data.volumes)) {
          return data.volumes.reduce((sum, vol) => sum + (vol || 0), 0);
      }
      return 0;
  });
  
  return {
      labels: exerciseNames,
      datasets: [{
          label: 'Total Volume',
          data: volumes,
          backgroundColor: exerciseNames.map(() => getRandomColor()),
          borderWidth: 1
      }]
  };
}

function getRandomColor() {
  const colors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getBackgroundColor(chartType) {
  const colors = {
    bar: 'rgba(54, 162, 235, 0.5)',
    line: 'rgba(255, 99, 132, 0.2)',
    doughnut: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)'
    ]
  };
  return colors[chartType] || 'rgba(54, 162, 235, 0.5)';
}

function getBorderColor(chartType) {
  const colors = {
    bar: 'rgba(54, 162, 235, 1)',
    line: 'rgba(255, 99, 132, 1)',
    doughnut: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)'
    ]
  };
  return colors[chartType] || 'rgba(54, 162, 235, 1)';
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export default workoutrouter;