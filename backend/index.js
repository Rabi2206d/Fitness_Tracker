import express from 'express';
import connectToMongo from './Database/db.js';
import cors from 'cors';
import auth from './routes/auth.js';
import nutritionrouter from './routes/nutrition.js';
import classrouter from './routes/class.js';
import trainerrouter from './routes/trainer.js';
import usersRouter from './routes/users.js';  // Correct import after fixing default export

const app = express();
const port = 4000;

// Use CORS middleware
app.use(cors());

// Connect to MongoDB
connectToMongo();

// Middleware for parsing JSON requests
app.use(express.json());

// Register routes
app.use('/api', usersRouter);  // Use the usersRouter here
app.use('/api', auth);
app.use('/api', nutritionrouter);
app.use('/api', classrouter);
app.use('/api', trainerrouter);
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
