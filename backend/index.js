import express from 'express';
import connectToMongo from './database/db.js';
import auth from "./routes/auth.js"
import cors  from 'cors';
import nutritionrouter from './routes/nutrition.js';
import classrouter from './routes/class.js';
import trainerrouter from './routes/trainer.js';
const app = express();
app.use(cors());
const port = 4000;
connectToMongo();
app.use(express.json());
app.use("/api/" , auth);
app.use("/api/" , nutritionrouter);
app.use("/api/" , classrouter);
app.use("/api/" , trainerrouter);


app.listen(port , ()=>{
    console.log(`App listen at http://localhost:${port}`)
})