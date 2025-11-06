import express from 'express';
import router from './routes/route.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

const API_PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use("/", router);


app.listen(API_PORT, () => {
    console.log(`Email API server running on http://localhost:${API_PORT}`);
});