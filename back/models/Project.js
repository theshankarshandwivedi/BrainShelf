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
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    ratings: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    user: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
            required: true
        }
    ],
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        required: false  // Changed from required: true to avoid validation issues with existing data
    }
}, {
    timestamps: true
})



module.exports = mongoose.model("Project",projectModel);