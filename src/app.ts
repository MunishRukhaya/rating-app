import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cookieParser());

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_CLIENT!).then(()=>console.log('mongoose connected'));

import authRouter from './routes/authRouter';
import mentorRouter from './routes/mentorRouter';
import studentRouter from './routes/studentRouter';

app.use('/auth', authRouter);
app.use('/mentor', mentorRouter);
app.use('/student', studentRouter);

app.listen(process.env.PORT,()=>console.log(`Listening on port ${process.env.PORT}`));
