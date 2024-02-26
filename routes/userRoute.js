import express from "express"
import { authorized } from '../middlewares/auth.js'
import upload from "../middlewares/multer.js"
import {
    signup,
    login,
    getAll,
    getUserById,
    deleteUserById,
    updateUserRole,
    logout,
    getOne,
    updateUserProfile
} from '../controllers/userController.js'


const userRoute = express.Router()

userRoute.post('/signup',upload.single("image"), signup)
userRoute.post('/login', login)
userRoute.get('/getall', getAll)
userRoute.get('/get/:id', getUserById)
userRoute.get('/getone', getOne)

userRoute.delete('/delete/:id', deleteUserById)
userRoute.put('/updateProfile',upload.single("image"), authorized,updateUserProfile)
userRoute.put('/updateUserRole', authorized,updateUserRole)
userRoute.get('/logout',authorized, logout)


export default userRoute;


