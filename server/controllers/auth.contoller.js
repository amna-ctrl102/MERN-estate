const User= require("../models/user.model.js")
const bcryptjs=require("bcryptjs");
const signup= async(req,res)=>{
    const {username,email,password}=req.body;
    const hashedPassword= bcryptjs.hashSync(password,10);
    const newUser= new User({username,email,password:hashedPassword});
    try{
        await newUser.save();
        res.status(201).json("User created successfully");
    }catch(err){
        res.status(500).json(err.errmsg);   
    }
};

module.exports={
    signup,
}