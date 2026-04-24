const express= require("express");
const mongoose= require("mongoose");
const authRouter= require("./routes/auth.router.js");
const userRouter=require("./routes/user.router.js");
const listingRouter=require("./routes/listing.router.js");
const cookieParser=require("cookie-parser");
require("dotenv").config();
const app=express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to Mongodb")
}).catch((err)=>{
    console.log(err);
})

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/listing",listingRouter);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});

app.listen(3000,()=>{
    console.log("server is running");
});