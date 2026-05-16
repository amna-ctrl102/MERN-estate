const express=require("express");
const { updateUser, deleteUser, getUserListings } = require("../controllers/user.controller");
const { verifyToken } = require("../utils/verifyUserToken");
const router=express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings)
module.exports=router;
