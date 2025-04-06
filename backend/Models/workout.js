import mongoose , {model} from "mongoose";
const {Schema} = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const workoutSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    category: { type: String, enum: ['strength', 'cardio', 'flexibility', 'balance'], required: true },
    exercises: [
      {
        name: String,
        sets: Number,
        reps: Number,
        weight: Number,
        notes: String,
      }
    ],
    tags: [String],
    date: { type: Date, default: Date.now },
}, { timestamps: true });

export default model('workout' , workoutSchema);