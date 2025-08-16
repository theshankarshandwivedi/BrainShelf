const mongoose = require("mongoose");

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        maxlength: 500
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    avatar: {
        type: String,
        default: null
    },
    skills: [{
        type: String
    }],
    github: {
        type: String
    },
    linkedin: {
        type: String
    },
    twitter: {
        type: String
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],
    education: {
        college: {
            type: String,
        },
        year: {
            type: Number,
        },
        degree: {
            type: String
        },
        field: {
            type: String
        }
    },
    experience: [{
        position: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        }
    }],
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", User);