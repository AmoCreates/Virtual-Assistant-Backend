import express, { Router } from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import axios from 'axios';

import connection from './config/connection.js';
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import geminiResponse from './gemini.js';

dotenv.config({path: './.env'});;
const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: 'https://virtual-assistant-eosin.vercel.app',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));


app.use('api/v1/auth', authRouter);
app.use('api/v1/user', userRouter);

app.get('/', async (req, res) => {
    let prompt = req.query.prompt || "What is the capital of France?";
    let data = await geminiResponse(prompt, "sia", "anmol");
    let ans = data.candidates[0].content.parts[0].text;
    return res.json({ans});
});

app.listen(port, async () => {
    await connection();
    console.log(`Server is listening at http://localhost:${port}`);
})
