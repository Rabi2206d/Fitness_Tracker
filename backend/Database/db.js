import {connect} from "mongoose";

const connectToMongo = async () =>{
    try {
        await connect("mongodb://127.0.0.1:27017/Fitness_Tracker");
        console.log("Connected To Mongo SuccessFully");
    } catch (error) {
        console.log(error);
    }
}

export default connectToMongo;