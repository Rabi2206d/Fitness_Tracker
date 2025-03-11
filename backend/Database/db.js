import mongoose from 'mongoose';

const ConnectToMongo = () => {
    mongoose.connect('mongodb://localhost:27017/');
    console.log("Database Connected Successfully!")
}

export default ConnectToMongo;