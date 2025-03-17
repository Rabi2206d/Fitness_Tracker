import mongoose , {model} from "mongoose";
const {Schema} = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const progressSchema = new Schema({
    user : {
        type : ObjectId,
        ref : 'user'
    },
    weight : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default model('progress' , progressSchema);