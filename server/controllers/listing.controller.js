const Listing = require("../models/listing.model");
const { errorHandler } = require("../utils/error");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorhandler(401, "You can only delete your own listing!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorhandler(401, "You can only update your own listing!"));
  }
  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" },
    );
    return res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }
};

const getListing=async(req,res,next)=>{
    try{
        const listing=await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404,"Listing not found!"))
        }
        return res.status(200).json(listing);
    }catch(error){
        next(error);
    }
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
};
