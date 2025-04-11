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

// Add this to your nutrition router
nutritionrouter.get("/nutritionanalytics", fetchUser, async (req, res) => {
    try {
        const { range = 'week' } = req.query;
        const userId = req.userid;
        
        // Calculate date ranges
        const endDate = new Date();
        let startDate = new Date();
        
        switch (range) {
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            case 'all': // 'all' or invalid
                startDate = null;
                break;
            default:
                startDate.setDate(endDate().getDate() - 7)
        }

        // Build query
        const query = { user: userId };
        if (startDate) {
            query.date = {
                $gte: startDate,
                $lte: endDate
            };
        }

        // Fetch nutrition data
        const nutritionData = await Nutritiondata.find(query).sort({ date: 1 });

        // Initialize analytics object
        const analytics = {
            summary: {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                mealCount: 0,
                foodItemCount: 0
            },
            dailyTrends: [],
            mealDistribution: {
                breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                snack: { calories: 0, protein: 0, carbs: 0, fat: 0 }
            },
            macroDistribution: {
                protein: 0,
                carbs: 0,
                fat: 0
            },
            topFoods: {},
            recentMeals: []
        };

        // Process each nutrition entry
        nutritionData.forEach(entry => {
            // Track recent meals (last 5)
            if (analytics.recentMeals.length < 5) {
                analytics.recentMeals.push({
                    date: entry.date,
                    meals: entry.meals.map(meal => ({
                        type: meal.type,
                        items: meal.items.map(item => item.name)
                    }))
                });
            }

            // Process each meal
            entry.meals.forEach(meal => {
                analytics.summary.mealCount++;
                
                // Process each food item
                meal.items.forEach(item => {
                    analytics.summary.foodItemCount++;
                    
                    // Aggregate totals
                    analytics.summary.totalCalories += item.calories || 0;
                    analytics.summary.totalProtein += item.protein || 0;
                    analytics.summary.totalCarbs += item.carbs || 0;
                    analytics.summary.totalFat += item.fat || 0;
                    
                    // Aggregate by meal type
                    if (analytics.mealDistribution[meal.type]) {
                        analytics.mealDistribution[meal.type].calories += item.calories || 0;
                        analytics.mealDistribution[meal.type].protein += item.protein || 0;
                        analytics.mealDistribution[meal.type].carbs += item.carbs || 0;
                        analytics.mealDistribution[meal.type].fat += item.fat || 0;
                    }
                    
                    // Track top foods
                    if (!analytics.topFoods[item.name]) {
                        analytics.topFoods[item.name] = {
                            count: 0,
                            totalCalories: 0,
                            totalProtein: 0
                        };
                    }
                    analytics.topFoods[item.name].count++;
                    analytics.topFoods[item.name].totalCalories += item.calories || 0;
                    analytics.topFoods[item.name].totalProtein += item.protein || 0;
                });
            });
        });

        // Calculate daily trends
        if (startDate) {
            // Calculate daily trends only if we have a date range
            const dailyData = {};
            
            // Initialize all days in range
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                dailyData[dateStr] = {
                    date: dateStr,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                };
            }
            
            // Aggregate data by day
            nutritionData.forEach(entry => {
                const dateStr = entry.date.toISOString().split('T')[0];
                if (dailyData[dateStr]) {
                    entry.meals.forEach(meal => {
                        meal.items.forEach(item => {
                            dailyData[dateStr].calories += item.calories || 0;
                            dailyData[dateStr].protein += item.protein || 0;
                            dailyData[dateStr].carbs += item.carbs || 0;
                            dailyData[dateStr].fat += item.fat || 0;
                        });
                    });
                }
            });
            
            analytics.dailyTrends = Object.values(dailyData);
        } else {
            // For "All Time", group by day of all available data
            const dailyData = {};
            
            nutritionData.forEach(entry => {
                const dateStr = entry.date.toISOString().split('T')[0];
                if (!dailyData[dateStr]) {
                    dailyData[dateStr] = {
                        date: dateStr,
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0
                    };
                }
                
                entry.meals.forEach(meal => {
                    meal.items.forEach(item => {
                        dailyData[dateStr].calories += item.calories || 0;
                        dailyData[dateStr].protein += item.protein || 0;
                        dailyData[dateStr].carbs += item.carbs || 0;
                        dailyData[dateStr].fat += item.fat || 0;
                    });
                });
            });
            
            analytics.dailyTrends = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        // Calculate macro distribution percentages
        const totalMacros = analytics.summary.totalProtein + analytics.summary.totalCarbs + analytics.summary.totalFat;
        if (totalMacros > 0) {
            analytics.macroDistribution.protein = (analytics.summary.totalProtein / totalMacros) * 100;
            analytics.macroDistribution.carbs = (analytics.summary.totalCarbs / totalMacros) * 100;
            analytics.macroDistribution.fat = (analytics.summary.totalFat / totalMacros) * 100;
        }

        // Get top 5 most consumed foods
        analytics.topFoods = Object.entries(analytics.topFoods)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([name, data]) => ({
                name,
                ...data,
                avgCalories: data.totalCalories / data.count,
                avgProtein: data.totalProtein / data.count
            }));

        res.status(200).json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default nutritionrouter;