import writingShema from '../models/writting.js'
import userSchema from '../models/user.js'

// create new writting
export const createWritting = async (req, res) => {
    const { title, content, userID } = req.body;
    try {
        if (!title || !content || !userID) {
            return res.status(400).json({ error: "Missing requirement: title, content, or userID" });
        } else {
            const newWritting = await writingShema.create({
                title,
                content,
                userID
            });
            return res.status(201).json({ message: "Create writing successfully", data: newWritting });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server error");
    }
};

//get all Writtings
export const getWrittings = async (req, res) => {
    try {
        const writtings = await writingShema.find().populate('userID'); // Populate with 'userID' field from writingSchema
        res.status(200).json({ message: "Writings", data: writtings });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
};

//get writting by id
export const getWrittingById = async (req, res) => {
    const id = req.params.id
    try {
        const writing = await writingShema.findOne({ _id: id }).populate('userID');
        if (!writing) {
            return res.status(404).json({ error: 'Writing not found' });
        }
        res.status(200).json(writing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//delete writting
export const deleteWritting = async (req, res) => {

    const id = req.params.id
    try {
        const deletedWriting = await writingShema.findByIdAndDelete({ _id: id });
        if (!deletedWriting) {
            return res.status(404).json({ error: 'Writing not found' });
        }
        res.status(200).json({ message: 'Writing deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


//update writting
export const updateWritting = async (req, res) => {
    const id = req.params.id
    const { title, content } = req.body;
    try {

        const updatedWriting = await writingShema.findByIdAndUpdate({ _id: id },
            { title, content }, { new: true });
        if (!updatedWriting) {
            return res.status(404).json({ error: 'Writing not found' });
        }
        res.status(200).json({ message: "updating writting successfuly", data: updatedWriting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}