import mongoose , {model} from "mongoose";
const {Schema} = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const progressSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    weight: Number,
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      legs: Number,
    },
    performance: {
      runTime: Number, // in seconds
      maxLift: Number, // weight lifted
    },
    date: { type: Date, default: Date.now },
})

export default model('progress' , progressSchema);