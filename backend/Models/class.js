import mongoose , {model} from "mongoose";
const {Schema} = mongoose;

const ClassSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    time: {
        type: String,
        required: true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default model('class' , ClassSchema);