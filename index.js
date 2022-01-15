import express from 'express';
import usersRouter from './routes/users.js';

const PORT = 3000;
const app = express();
app.use(express.json());
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.send('General Manager logged in :)');
});
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
