import 'dotenv/config';
import express from 'express';
import szakkorokRouter from './routes/szakkorok.js';

let vegpontok = [
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/szakkorok` },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/szakkorok/:id` }
]

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
app.use('/szakkorok', szakkorokRouter);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});