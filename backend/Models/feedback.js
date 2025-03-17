import mongoose , {model} from "mongoose";
const {Schema} = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const FeedbackSchema = new Schema({
    user : {
        type : ObjectId,
        ref : 'user'
    },
    comments : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default model('feedback' ,FeedbackSchema);