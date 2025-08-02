const mongoose = require("mongoose");

const projectModel = new mongoose.Schema({
    token: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model",
    },
    name: {
        type: String,
        required: true
    },
    // thumbNail: {
    //     type: String,
    //     required: true,
    // },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    },
    user: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
            required: true
        }
    ]
})



module.exports = mongoose.model("Project",projectModel);