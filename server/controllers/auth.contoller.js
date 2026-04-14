const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "wrong Credentials"));
    }
    const token = jwt.sign({ 
        id: validUser._id 
    }, process.env.JWT_SECRET);
    const {password:pass,...rest}=validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
};
