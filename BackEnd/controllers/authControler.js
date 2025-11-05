import bcrypt, { compareSync } from "bcryptjs";
// User waa mongodb tableka ayuu ku hayaa
import User from "../models/userModal.js";
import jwt from "jsonwebtoken";

// signUp
// bcrypt means passwordka hash dhex geli
// token wuxuuu qabtaa  inuu qofka uu login ahaado ilaa uu logout ka dhahaayo
export let signUp = async (req, res, next) => {
  // console.log(req.body)
  //   res.send({ message: "sign up route working " });

  let { userName, password, email } = req.body;
  // passwordka aan hash gareyno

  let hashedPassword = bcrypt.hashSync(password, 10);

  // User waa tableka ka diyaarsan databaseka oo loo baasgareeyay body wax ka imaaday oo ah inputs qimahooda
  let newUser = new User({ userName, password: hashedPassword, email });

  // save the data to the mongodb

  try {
    await newUser.save();
    // created 201
    res.status(201).json({
      success: true,
      message: "User Save Successfully ",
      data: newUser,
    });
  } catch (error) {
    // res.status(400).json({error: error.message})

    next(error);
  }
};

export let signIn = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    // datasbase tag waxaad ka dhex radiisaa email body laga soo diray
    let validUser = await User.findOne({ email });

    // checkgareeya haduu jiro iyo hadii kale

    if (!validUser) return next(404, "User not found");

    // checkagreey passwordka

    // compareSync oo ah lawo password is bar bardhig

    // password  kowaad waa midka body laga soo geliyay  passwordka lawaad waa  midka yaala database
    let isMatch = bcrypt.compareSync(password, validUser.password);

    // hadii passwordka aan lasoo helin oo lasoo waayo
    if (!isMatch) return next(401, "Invalid credentials");

    // cookies waa file yar ama data yar aad ku keydin karto  browserkaaga hadii uu qofka uu login uu sameeyo uu browserka uu xiro uu kusoo noqdo uu dib ugali asigoon login mar lawaad uu sameyneynin

    // doc waxay kusoo saraysaa wax walbo
    const { password: pass, ...rest } = validUser._doc;
    // start token
    const token = jwt.sign(
      { id: validUser.id, userName: validUser.userName },
      process.env.JWT_SECRET
    );
    // httponly website lee laga isticmaali karaa
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// google authincation

export let google = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    // hadii uu user uu jiro

    if (user) {
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      let { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } 
    // hadii uu userka  jirin waa in hadda la diwangeliyaa 
    else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // hash the password
      let hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      // generated username
      let username =
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      let newUser = new User({
        username,
        password: hashedPassword,
        email: req.body.email,
        avatar: req.body.photo,
      });

      await newUser.save();
      let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      let { password: pass, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// signout 

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "User signed out" });
  } catch (error) {
    next(error);
  }
};
