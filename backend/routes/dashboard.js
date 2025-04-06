import express from 'express';
import fetchUser from '../middleware/fetchUser.js';
import Workout from '../Models/workout.js';
import Nutrition from '../Models/Nutrition.js';
import Progress from '../Models/progress.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/dashboard', fetchUser, async (req, res) => {
  try {
    const userId = req.userid;

    const recentWorkouts = await Workout.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentNutrition = await Nutrition.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProgress = await Progress.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: "User dashboard data fetched successfully",
      dashboard: {
        workouts: recentWorkouts,
        nutrition: recentNutrition,
        progress: recentProgress
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default dashboardRouter;
