import express from 'express';
import trainerdata from "../Models/trainer.js";

const trainerrouter = express.Router();

// Route 1: Create a new class (Sign Up)
trainerrouter.post("/addtrainer", async (req, res) => {
    const { name, email, age,height,weight } = req.body;

    try {
        if (!name || !email || !age || !height || !weight) {
            return res.status(400).json({ error: "All Fields Are required" });
        }
        const existingemail = await trainerdata.findOne({ email });
        if (existingemail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const newTrainer = new trainerdata({
            name, email, age,height,weight
        });

        await newTrainer.save(); // Save the new class to the database
        res.status(201).json({ success: "Trainer Created" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 2: Get all classes
trainerrouter.get("/fetchtrainer", async (req, res) => {
    try {
        const classes = await trainerdata.find();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 3: Get a class by ID
trainerrouter.get("singletrainer/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const trainerData = await trainerdata.findById({_id : id});
        if (!trainerData) {
            return res.status(404).json({ error: "Trainer not found" });
        }
        res.status(200).json(trainerData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
   
});

// Route 4: Update a class by ID
trainerrouter.put("updatetrainer/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, age,height,weight } = req.body;

    try {
        const updatedTrainer = await trainerdata.findByIdAndUpdate(id, {
            name, email, age,height,weight
        }, { new: true });

        if (!updatedTrainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        res.status(200).json({ success: "Trainer updated" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 5: Delete a class by ID
trainerrouter.delete("deletetrainer/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTrainer = await trainerdata.findByIdAndDelete(id);
        if (!deletedTrainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        res.status(200).json({ success: "Trainer deleted" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default trainerrouter;