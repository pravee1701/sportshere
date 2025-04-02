import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import matchesRoute from './routes/matches.route.js';
import connectDB from './config/db.js';
import usersRoutes from './routes/user.route.js';
import teamRoutes from './routes/teams.route.js'

dotenv.config();

const app = express();

connectDB();

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the sportshere backend API' });
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());

app.use('/api/v1/matches', matchesRoute);
app.use("/api/v1/user", usersRoutes);
app.use("/api/v1/team", teamRoutes)




export default app;