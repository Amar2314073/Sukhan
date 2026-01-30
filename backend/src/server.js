const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/database');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const redisClient = require('./config/redis');
const cors = require('cors')



app.use(cors({
    origin:['http://localhost:5173', 'https://sukhan-pi.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))


app.use(express.json());   // to convert json into js object
app.use(cookieParser());   // to parse cookie

app.get("/health", (req, res) => {
  res.status(200).send("Server is awake 🚀");
});


app.use('/api', routes);


const PORT = process.env.PORT || 8080


const InitializeConnection = async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("Connected to Database");

        app.listen(PORT, ()=>{
            console.log(`Server listening at port number : ${PORT}`);
        })
    }
    catch(err){
        console.log("Error: "+err.message);
    }
}

InitializeConnection();

