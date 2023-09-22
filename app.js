require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./db/connect');
const app = express();

const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');
const authenticated = require('./middleware/authentication');

const PORT = process.env.PORT || 3000;  

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs : 15 * 60 * 1000,
    max : 100 // limit each IP to 100 requests per windowMs
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res)=>{
    res.send('<h1>Jobs API</h1>');
})

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticated, jobRouter);

// Middleware
app.use(errorHandler);   
app.use(notFound);

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}...`));
    }
    catch(error){
        console.log(error);
    }
}

start();