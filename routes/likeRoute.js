import express from "express";
import { authorized } from "../middlewares/auth.js";
import { addLike, unlikePost, getLikesByPostId } from '../controllers/likeController.js'


const likeRoute = express.Router()

likeRoute.post('/add/:id', authorized, addLike)
likeRoute.post('/remove/:id', authorized, unlikePost)
likeRoute.get('/get', getLikesByPostId)

export default likeRoute