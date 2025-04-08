import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import progressdata from "../Models/progress.js";

const progressrouter = express.Router();

progressrouter.get("/getprogress" , fetchUser , async (req , res)=>{
    try {
        const progress = await progressdata.find({user : req.userid})
        res.status(200).json(progress);
    } catch (error) {
       res.status(500).json({error : "Internal Server Error"});
    }
})

progressrouter.post("/addprogress" , fetchUser , async (req , res)=>{
    const { weight, measurements, performance } = req.body;
    try {
       if(!weight || !measurements || !performance){
        return res.status(400).json({error : "All fields are required"});
       }

       const progress = new progressdata({
        user: req.userid,
        weight,
        measurements,
        performance,
      });
       const saveProgress = await progress.save();
       res.status(200).json(saveProgress);
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
})

progressrouter.delete("/deleteprogress/:id", fetchUser , async (req, res) => {
    const { id } = req.params;

    try {
        const progress = await progressdata.findById(id);
        if (!progress) {
            return res.status(404).json({ error: "Progress not found" });
        }

        // Check if the user is the owner of the feedback
        if (progress.user.toString() !== req.userid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await progressdata.findByIdAndDelete(id);
        res.status(200).json({ message: "Progress deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


progressrouter.put("/updateprogress/:id", fetchUser , async (req, res) => {
    const progressid = req.params.id;

    try {
        const progress = await progressdata.findById(progressid);
        if (!progress) {
            return res.status(404).json({ error: "Progress not found" });
        }

        if (progress.user.toString() !== req.userid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        Object.assign(progress, req.body);
        const updateProgress = await progress.save();
        res.status(200).json(updateProgress);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default progressrouter;