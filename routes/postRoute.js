import express from "express"
import upload from "../middlewares/multer.js"
import { authorized } from "../middlewares/auth.js"
import {
    addPost,
    getAllPost,
    addPhotograph,
    addDrawing,
    getAllDrawings,
    getDrawingById,
    getAllPhotographs,
    getPhotographById,
    updateDrawingById,
    deleteDrawingById,
    getLastPosts,
    getAllWritings,
    getWritingById,
    deleteAllDrawings,
    getPostById,
    getUserPosts,
    updatePostById,
    deleteOwnPost

} from '../controllers/postController.js'


const postRoute = express.Router()
//user
postRoute.post('/add', authorized,upload.single("image"),addPost)
//admin
postRoute.get('/getall', getAllPost)
postRoute.get('/getbyId/:id', getPostById)
postRoute.get('/getbyUserId/:id', getUserPosts)


postRoute.post('/addphoto',upload.single("image"), addPhotograph)
postRoute.post('/adddraw', upload.single("image"),addDrawing)
postRoute.get('/getdraw', getAllDrawings)
postRoute.get('/getdrawid/:id', getDrawingById)
postRoute.get('/getallphoto', getAllPhotographs)
postRoute.get('/getphotoid/:id', getPhotographById)
postRoute.get('/getallWritings',getAllWritings)
postRoute.get('/getWrtingbyId/:id',getWritingById)
//admin
postRoute.put('/update/:id',upload.single("image"),updateDrawingById)
//user
postRoute.put('/post/:id',authorized,upload.single("image"),updatePostById)

//admin
postRoute.delete('/delete/:id', deleteDrawingById)
//user
postRoute.delete('/deleteUserPost/:id', authorized,deleteOwnPost)
postRoute.delete('/deleteAll', deleteAllDrawings)

postRoute.get('/getlastest', getLastPosts)

export default postRoute;

