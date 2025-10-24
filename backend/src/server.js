const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/database');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const redisClient = require('./config/redis');

app.use(express.json());   // to convert json into js object
app.use(cookieParser());   // to parse cookie



app.use('/api', routes);




const InitializeConnection = async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("Connected to Database");

        app.listen(process.env.PORT, ()=>{
            console.log(`Server listening at port number : ${process.env.PORT}`);
        })
    }
    catch(err){
        console.log("Error: "+err.message);
    }
}

InitializeConnection();

