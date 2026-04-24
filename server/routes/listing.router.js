const express=require("express");
const { createListing } = require("../controllers/listing.controller");
const { verifyToken } = require("../utils/verifyUserToken");
const router=express.Router();

router.post("/create",verifyToken,createListing);

module.exports=router;