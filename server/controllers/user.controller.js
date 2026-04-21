const User=require("../models/user.model")
const updateUser=async(req, res, next)=>{
    try{
        const {id}=req.params;
        const{username, email, avatar}=req.body;
        const updatedUser=await User.findByIdAndUpdate(
            id,
            {$set:{username, email, avatar}},
            {new:true}
        )
        if(!updatedUser) return res.status(404).json(message,"user not found");
        const { password, ...rest } = updatedUser._doc;
        return res.status(200).json(rest);
    }catch(e){
        next(e);
    }
};
module.exports={
    updateUser,
} 