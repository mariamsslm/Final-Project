import express from "express"
import {
    createWritting,
    getWrittings,
    getWrittingById,
    deleteWritting,
    updateWritting
} from '../controllers/writingController.js'
const writtingRoute = express.Router()


writtingRoute.post('/add', createWritting)
writtingRoute.get('/getall', getWrittings)
writtingRoute.get('/get/:id', getWrittingById)
writtingRoute.put('/update/:id', updateWritting)
writtingRoute.delete('/delete/:id', deleteWritting)

export default writtingRoute;
