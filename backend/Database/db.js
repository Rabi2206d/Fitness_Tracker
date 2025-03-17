import {connect} from "mongoose";

const connectToMongo = async () =>{
    try {
        await connect("mongodb://localhost:27017/Fitness_Tracker");
        console.log("Connected To Mongo SuccessFully");
    } catch (error) {
        console.log(error);
    }
}

export default connectToMongo;