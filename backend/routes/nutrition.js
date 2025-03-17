import express from "express";
import fetchUser from "../midleware/fetchUser.js";
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
    const {mealType , foodItems , calories} = req.body;
    
    try {
       if(!mealType || !foodItems || !calories){
        return res.status(400).json({error : "All fields are required"});
       }

       const nutrition = new Nutritiondata({
        mealType,
        foodItems,
        calories,
        user : req.userId
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


// Route : 4 Update Note

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