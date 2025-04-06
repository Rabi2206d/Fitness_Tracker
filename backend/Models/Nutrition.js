import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const nutritionSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    meals: [
      {
        type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
        items: [
          {
            name: String,
            quantity: String,
            calories: Number,
            protein: Number,
            carbs: Number,
            fat: Number,
          }
        ]
      }
    ],
    date: { type: Date, default: Date.now },
}, { timestamps: true });

export default models.nutritions || model('nutritions', nutritionSchema);