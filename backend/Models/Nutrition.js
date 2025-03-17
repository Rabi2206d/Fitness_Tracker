import mongoose , {model} from "mongoose";
const {Schema} = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const nutritionSchema = new Schema({
    user : {
        type : ObjectId,
        ref : 'user'
    },
    mealType : {
        type : String,
        required : true
    },
    foodItems : {
        type : String,
        required : true
    },
    calories : 
    {
        type : Number,
        required : true
    }
    ,
    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default model('nutritions' , nutritionSchema);