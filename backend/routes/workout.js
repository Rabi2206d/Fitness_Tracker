import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import workdata from '../Models/workout.js';
const workoutrouter = express.Router();

// Get Workout Details
workoutrouter.get("/getworkoutdetails" , fetchUser , async (req , res)=>{
    try {
        const workout = await workdata.find({user : req.userId})
        res.status(200).json(workout);
    } catch (error) {
       res.status(500).json({error : "Internal Server Error"});
    }
})

// Add Workout
workoutrouter.post("/addworkout" , fetchUser , async (req , res)=>{
    const { exerciseName, sets, reps, weight, notes, category, tags } = req.body;
    try {
       if(!exerciseName || !sets || !reps || !weight || !notes || !category || !tags){
        return res.status(400).json({error : "All fields are required"});
       }

       const workout = new workdata({
        user: req.userid,
        exerciseName,
        sets,
        reps,
        weight,
        notes,
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

        if (workout.user.toString() !== req.userId) {
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
    const { sets, reps } = req.body;
    const workoutid  = req.params.id;

    try {
        const workout = await workdata.findById(workoutid);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
    
        if (workout.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
    
        workout.sets = sets !== undefined ? sets : workout.sets; 
        workout.reps = reps !== undefined ? reps : workout.reps; 
    
        const updatedWorkout = await workout.save(); 
        res.status(200).json(updatedWorkout);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Internal Server Error" });
    }
   

});



export default workoutrouter;