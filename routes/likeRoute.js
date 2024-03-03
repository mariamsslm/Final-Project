import express from "express";
import { authorized } from "../middlewares/auth.js";
import { addLike, unlikePost, getLikesByPost,getLikesByPostId } from '../controllers/likeController.js'


const likeRoute = express.Router()

likeRoute.post('/add/:id', authorized, addLike)
likeRoute.post('/remove/:id', authorized, unlikePost)
likeRoute.get('/get', getLikesByPost)
likeRoute.get('/get/:id', getLikesByPostId)


export default likeRoute