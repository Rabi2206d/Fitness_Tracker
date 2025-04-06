import express from 'express';
import connectToMongo from './Database/db.js';
import cors from 'cors';
import auth from './routes/auth.js';
import nutritionrouter from './routes/nutrition.js';
import classrouter from './routes/class.js';
import trainerrouter from './routes/trainer.js';
import workoutrouter from './routes/workout.js';
import progressrouter from './routes/progress.js';
import feedbackrouter from './routes/feedback.js';
import dashboardRouter from './routes/dashboard.js';
import exportrouter from './routes/export.js';
import usersRouter from './routes/users.js';

const app = express();
const port = 4000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
connectToMongo();
app.use(express.json());

app.use('/api/', usersRouter); 
app.use("/api/" , auth);
app.use("/api/" , nutritionrouter);
app.use("/api/" , classrouter);
app.use("/api/" , trainerrouter);
app.use("/api/" , workoutrouter);
app.use("/api/" , progressrouter);
app.use("/api/" , feedbackrouter);
app.use("/api/" , dashboardRouter);
app.use("/api/export" , exportrouter);
app.use('/uploads', express.static('uploads'));

app.listen(port , ()=>{
    console.log(`App listen at http://localhost:${port}`)
});