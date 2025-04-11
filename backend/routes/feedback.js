import express from "express";
import fetchUser from '../middleware/fetchUser.js';
import feedbackdata from "../Models/feedback.js";

const feedbackrouter = express.Router();

// GET: Fetch feedbacks for the logged-in user
feedbackrouter.get("/getfeedback", fetchUser, async (req, res) => {
  try {
    const feedback = await feedbackdata.find({ user: req.userid });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Add new feedback
feedbackrouter.post("/addfeedback", fetchUser, async (req, res) => {
  const { firstName, lastName, quality, suggestion } = req.body;

  try {
    if (!firstName || !lastName || !quality || !suggestion) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const feedback = new feedbackdata({
      user: req.userid,
      firstName,
      lastName,
      quality,
      suggestion
    });

    const savedFeedback = await feedback.save();
    res.status(200).json(savedFeedback);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE: Remove feedback by ID
feedbackrouter.delete("/deletefeedback/:id", fetchUser, async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedback = await feedbackdata.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.userid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await feedbackdata.findByIdAndDelete(feedbackId);
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT: Update feedback
feedbackrouter.put("/updatefeedback/:id", fetchUser, async (req, res) => {
  const { firstName, lastName, quality, suggestion } = req.body;
  const feedbackId = req.params.id;

  try {
    const feedback = await feedbackdata.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.userid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update fields
    feedback.firstName = firstName || feedback.firstName;
    feedback.lastName = lastName || feedback.lastName;
    feedback.quality = quality || feedback.quality;
    feedback.suggestion = suggestion || feedback.suggestion;

    const updatedFeedback = await feedback.save();
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default feedbackrouter;
