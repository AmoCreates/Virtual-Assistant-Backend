import express, { Router } from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import connection from './config/connection.js';
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'


dotenv.config({path: './.env'});;
const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST"]
}));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.listen(port, async () => {
    await connection();
    console.log(`Server is listening at http://localhost:${port}`);
})