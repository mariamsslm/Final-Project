import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./config/config.js";
import cookieParser from "cookie-parser";
import postRoute from './routes/postRoute.js'
// import  writtingRoute from './routes/writtingRoute.js' 
import likeRoute from './routes/likeRoute.js'
import  userRoute from './routes/userRoute.js'

dotenv.config();

const PORT = process.env.PORT || 5100;
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use("/images", express.static("images"));

// const corsOption = {
//     origin: ["http://localhost:3000", process.env.FRONTEND_ORIGIN],
//     credentials: true,
//     optionsSuccessStatus: 200,
// };

app.use(cookieParser());
app.use(cors());

app.use('/post',postRoute)
// app.use('/writting',writtingRoute)
app.use('/like',likeRoute)
app.use('/user', userRoute)


app.listen(PORT, () => {
    connect();
    console.log(`running on port: ${PORT}`);
    if (PORT === 5100) {
        console.log(
            "ERROR: issue reading port from process.env. Continue with caution! ..."
        );
    }
});
