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
    deleteOwnPost,
    addPostAmin,
    getAllPostImages,
    getLastThreePostImages

} from '../controllers/postController.js'


const postRoute = express.Router()
//user
postRoute.post('/add', authorized,upload.single("image"),addPost)
//admin
postRoute.get('/getall', getAllPost)
postRoute.get('/getbyId/:id', getPostById)
postRoute.get('/getbyUserId/:id', getUserPosts)

postRoute.get('/getImages', getAllPostImages)
postRoute.get('/getlastImages', getLastThreePostImages)




postRoute.post('/addphoto',upload.single("image"), addPhotograph)
postRoute.post('/adddraw', upload.single("image"),addDrawing)
postRoute.get('/getdraw', getAllDrawings)
postRoute.get('/getdrawid/:id', getDrawingById)
postRoute.get('/getallphoto', getAllPhotographs)
postRoute.get('/getphotoid/:id', getPhotographById)
postRoute.get('/getallWritings',getAllWritings)
postRoute.get('/getWrtingbyId/:id',getWritingById)
//admin\
postRoute.post('/addpost',upload.single("image"), addPostAmin)
postRoute.put('/update/:id',upload.single("image"),updateDrawingById)
postRoute.delete('/delete/:id',deleteDrawingById)
postRoute.delete('/deleteAll', deleteAllDrawings)


//user
postRoute.put('/post/:id',authorized,upload.single("image"),updatePostById)
postRoute.delete('/deleteUserPost/:id', authorized,deleteOwnPost)

postRoute.get('/getlastest', getLastPosts)

export default postRoute;

