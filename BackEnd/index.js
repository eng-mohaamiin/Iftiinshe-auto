import express from "express";
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import router from "./Routes/userRouter.js";
import authRouter from "./Routes/auth.Router.js"
import cookieParser from "cookie-parser";
import listingRouoter from "./Routes/ListingRouter.js";
import path from "path"



let  app = express()


app.use(cookieParser())

// si env kugu shaqeeyo waxaa u baahantahay inaa install gareyso npm i dotenv 
dotenv.config()
let __dirname = path.resolve()

app.use(express.json());
let port = process.env.PORT || 5000





app.use("/api/user", router)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouoter)
app.use(express.static(path.join(__dirname, "/FrontEnd/dist")))
app.get("*", (req, res)=>{
  res.sendFile(path.join(__dirname, "FrontEnd", "dist", "index.html"))
})




app.listen(port, () => {
    connectDB()
    console.log(`server is  runing at http://localhost:${port}`);

});


// start middlware 

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
