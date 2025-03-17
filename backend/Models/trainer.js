import mongoose , {model} from "mongoose";
const {Schema} = mongoose;

const TrainerSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
   
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default model('trainers' , TrainerSchema);