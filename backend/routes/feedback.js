import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import feedbackdata from '../Models/feedback.js';
const feedbackrouter = express.Router();

feedbackrouter.get("/getfeedback" , fetchUser , async (req , res)=>{
    try {
        const feedback = await feedbackdata.find({user : req.userid})
        res.status(200).json(feedback);
    } catch (error) {
       res.status(500).json({error : "Internal Server Error"});
    }
})

feedbackrouter.post("/addfeedback" , fetchUser , async (req , res)=>{
    const {  comments} = req.body;
    try {
       if(!comments){
        return res.status(400).json({error : "All fields are required"});
       }

       const feedback = new feedbackdata({
        comments,
        user : req.userid
       })
       const saveFeedback = await feedback.save();
       res.status(200).json(saveFeedback);
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
})

feedbackrouter.delete("/deletefeedback/:id", fetchUser , async (req, res) => {
    const feedbackId = req.params.id;

    try {
        const feedback = await feedbackdata.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        // Check if the user is the owner of the feedback
        if (feedback.user.toString() !== req.userid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await feedbackdata.findByIdAndDelete(feedbackId);
        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


feedbackrouter.put("/updatefeedback/:id", fetchUser , async (req, res) => {
    const { comments } = req.body;
    const feedbackId = req.params.id;

    try {
        const feedback = await feedbackdata.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        // Check if the user is the owner of the feedback
        if (feedback.user.toString() !== req.userid) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        feedback.comments = comments || feedback.comments; // Update comments if provided
        const updatedFeedback = await feedback.save();
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default feedbackrouter;