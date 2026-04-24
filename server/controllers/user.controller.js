const User=require("../models/user.model.js");
const { errorHandler } = require("../utils/error");
const bcryptjs = require("bcryptjs");

const updateUser=async(req, res, next)=>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,"You can only update your account"));
    }
    try{
        if(req.body.password){
            req.body.password=await bcryptjs.hash(req.body.password,10);
        }
        const id=req.params.id;
        const{username, email, avatar}=req.body;
        const updatedUser=await User.findByIdAndUpdate(id,{
            $set:{
                username, 
                email, 
                password:req.body.password,
                avatar,
            },
        },{ returnDocument: "after" });
        if(!updatedUser) return res.status(404).json(message,"user not found");
        const { password:pass, ...rest } = updatedUser._doc;
        return res.status(200).json(rest);
    }catch(e){
        next(e);
    }
};

const deleteUser=async(req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,"You can only delete your account"));
    }
    try{
        const id=req.params.id;
        await User.findByIdAndDelete(id);
        res.clearCookie("access_token");
        return res.status(200).json({message:"User has been deleted"});
    }catch(error){
        next(error);
    }
};

module.exports={
    updateUser,
    deleteUser,
} 