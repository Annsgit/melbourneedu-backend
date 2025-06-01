import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.get('/search', (req, res) => {
  res.send('Search route works!');
});

export default app;
