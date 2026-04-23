const express=require("express");
const { updateUser } = require("../controllers/user.controller");
const { verifyToken } = require("../utils/verifyUserToken");
const router=express.Router();

router.post("/update/:id",verifyToken,updateUser);
module.exports=router;
