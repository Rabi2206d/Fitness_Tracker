import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import Nutritiondata from '../Models/Nutrition.js';
const nutritionrouter = express.Router();

nutritionrouter.get("/getnutrition" , fetchUser , async (req , res)=>{
    try {
        const nutrition = await Nutritiondata.find({user : req.userId})
        res.status(200).json(nutrition);
    } catch (error) {
       res.status(500).json({error : "Internal Server Error"});
    }
})


// Route : 2 Add Note
nutritionrouter.post("/addnutrition" , fetchUser , async (req , res)=>{
    const { mealType, foodItems, calories, macros } = req.body;
    
    try {
       if(!mealType || !foodItems || !calories){
        return res.status(400).json({error : "All fields are required"});
       }

       const nutrition = new Nutritiondata({
        user: req.userid,
        mealType,
        foodItems,
        calories,
        macros,
       })
       const saveNutrition = await nutrition.save();
       res.status(200).json(saveNutrition);
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
})

// Route : 3 Delete Note
nutritionrouter.delete("/deletenutrition/:id", fetchUser, async(req,res)=>{
    const {id} = req.params;
    try {
        let nutrition = await Nutritiondata.findById({_id : id});      
        if(!note)
        {
            return res.status(400).json({error: "Nutrition not Found"});
        }
        
        // if(note.user.toString !== req.userId)
        // {
        //     return res.status(400).json({error: "Not Allowed"});
        // }
        nutrition = await Nutritiondata.findByIdAndDelete(id);
        return  res.status(400).json({success: "Nutrition Deleted",nutrition : nutrition})
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }

})


// Route : 4 Update Nutrition
nutritionrouter.put("/updatenutrition/:id", fetchUser, async (req, res) => {
    const { id } = req.params;
    const { mealType, foodItems, calories } = req.body;

    try {
        // Find the nutrition record by ID
        let nutrition = await Nutritiondata.findById(id);

        // If nutrition doesn't exist, return an error
        if (!nutrition) {
            return res.status(400).json({ error: "Nutrition record not found" });
        }

        // Ensure the user is the owner of the nutrition record
        if (nutrition.user.toString() !== req.userId) {
            return res.status(403).json({ error: "Not allowed to update another user's record" });
        }

        // Update the nutrition record with the new data
        nutrition = await Nutritiondata.findByIdAndUpdate(
            id,
            { $set: { mealType, foodItems, calories } },
            { new: true }
        );

        // Return the updated nutrition record
        return res.status(200).json(nutrition);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


//Route : 5 // update and fetch route
nutritionrouter.get('getnotebyid/:id',fetchUser ,async (req,res)=>
{
const id  =req.params.id;

try {
    const nutrition = await  Nutritiondata.findById(id);
    if(!nutrition)
    {
        res.status(500).json({error : "No Notes found"});
    }
    return res.json({nutrition})
} catch (error) {
    res.status(500).json({error : "Internal Server Error"});
}
})
export default nutritionrouter;