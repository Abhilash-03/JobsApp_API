require('dotenv').config();
require('express-async-errors');

const express = require('express');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./db/connect');
const app = express();

const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');

const PORT = process.env.PORT || 3000;  

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobRouter);

app.use(notFound);
app.use(errorHandler);   


app.get('/', (req, res) => {
    res.send("Jobs app API");
})

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, console.log(`Server listening on port ${PORT}...`));
    }
    catch(error){
        console.log(error);
    }
}

start();