import express from 'express';
import Classdata from "../Models/class.js";

const classrouter = express.Router();

// Route 1: Create a new class (Sign Up)
classrouter.post("/addclass", async (req, res) => {
    const { title, description, date, time } = req.body;

    try {
        if (!title || !description || !date || !time) {
            return res.status(400).json({ error: "All Fields Are required" });
        }
        const existingClass = await Classdata.findOne({ title });
        if (existingClass) {
            return res.status(400).json({ error: "Class already exists" });
        }
        const newClass = new Classdata({
            title, description, date, time
        });

        await newClass.save(); // Save the new class to the database
        res.status(201).json({ success: "Class Created", class: newClass });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 2: Get all classes
classrouter.get("/fetchclass", async (req, res) => {
    try {
        const classes = await Classdata.find();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 3: Get a class by ID
classrouter.get("singleclass/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const classData = await Classdata.findById(id);
        if (!classData) {
            return res.status(404).json({ error: "Class not found" });
        }
        res.status(200).json(classData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 4: Update a class by ID
classrouter.put("updateclass/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, date, time } = req.body;

    try {
        const updatedClass = await Classdata.findByIdAndUpdate(id, {
            title, description, date, time
        }, { new: true });

        if (!updatedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.status(200).json({ success: "Class updated", class: updatedClass });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 5: Delete a class by ID
classrouter.delete("deleteclass/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedClass = await Classdata.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.status(200).json({ success: "Class deleted" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default classrouter;