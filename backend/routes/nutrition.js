import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import Nutritiondata from '../Models/Nutrition.js';
const nutritionrouter = express.Router();

nutritionrouter.get("/getnutrition" , fetchUser , async (req , res)=>{
    try {
        const nutrition = await Nutritiondata.find({user : req.userid})
        res.status(200).json(nutrition);
    } catch (error) {
       res.status(500).json({error : "Internal Server Error"});
    }
})


// Route : 2 Add Note
nutritionrouter.post("/addnutrition" , fetchUser , async (req , res)=>{
    const { mealType, foodItems } = req.body;
    
    try {
       if(!mealType || !foodItems || foodItems.length === 0){
        return res.status(400).json({error : "All fields are required"});
       }

       const nutrition = new Nutritiondata({
        user: req.userid,
        meals: [{
            type: mealType,
            items: foodItems, 
        }],
       })
       const saveNutrition = await nutrition.save();
       res.status(200).json(saveNutrition);
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
})

// Route : 3 Delete Note
nutritionrouter.delete("/deletenutrition/:id", fetchUser, async(req,res)=>{
    const { id } = req.params;
    try {
        let nutrition = await Nutritiondata.findById(id);      
        if(!nutrition)
        {
            return res.status(400).json({error: "Nutrition not Found"});
        }
        
        // if(note.user.toString !== req.userid)
        // {
        //     return res.status(400).json({error: "Not Allowed"});
        // }
        await Nutritiondata.findByIdAndDelete(id);
        return res.status(200).json({success: "Nutrition Deleted",nutrition : nutrition})
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }

})


// Route : 4 Update Nutrition
nutritionrouter.put("/updatenutrition/:id", fetchUser, async (req, res) => {
    const { id } = req.params;

    try {
        let nutrition = await Nutritiondata.findById(id);
        if (!nutrition) {
            return res.status(400).json({ error: "Nutrition record not found" });
        }
        if (nutrition.user.toString() !== req.userid) {
            return res.status(403).json({ error: "Not Authorized" });  
        }

        const { mealType, foodItems } = req.body;
        nutrition.meals[0].type = mealType;
        nutrition.meals[0].items = foodItems;

        const updatedNutrition = await nutrition.save();
        return res.status(200).json(updatedNutrition);
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