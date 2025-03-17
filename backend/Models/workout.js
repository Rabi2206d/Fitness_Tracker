import mongoose , {model} from "mongoose";
const {Schema} = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const workoutSchema = new Schema({
    user : {
        type : ObjectId,
        ref : 'user'
    },
    sets : {
        type : String,
        required : true
    },
    reps : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default model('workout' , workoutSchema);