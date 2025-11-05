import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../models/userModal.js";
import carListing from "../models/listtingModal.js";

// all api
export let test = (req, res) => res.send({ message: "API is working " });

export let updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own profile"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  // user idiiga ku jiro cookie hadii uusan lamid aheyn req body laga soo diray
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "user has been deleted" });
  } catch (error) {
    next(error);
  }
};



export let  getUserListing = async(req, res,next)=>{
  // id tokenka ku jiro iyo id parasm hadey isku mid noqdaan 
  if(req.user.id === req.params.id){
    try {
      let listings = await carListing.find({sellerRef: req.params.id})
      res.status(200).json(listings)
    } catch (error) {
      next(error)
    }
  }
  else {
    return next(errorHandler(401, "you can only view your own listings"))
  }
}

// getuser 

export let getUser = async (req,res,next)=>{
  try {
    let user = await User.findById(req.params.id)
    if(!user) return next(errorHandler(404, "User Not found"))
      let {password: pass, ...rest} = user._doc
    res.status(200).json(rest)
  } catch (error) {
    next(err)
  }
}