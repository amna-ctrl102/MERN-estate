const express= require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const app=express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to Mongodb")
}).catch((err)=>{
    console.log(err);
})

app.listen(3000,()=>{
    console.log("server is running");
});