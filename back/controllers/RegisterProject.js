const User = require("../models/User");
const Project = require("../models/Project");
const cloudinary = require("cloudinary").v2;

async function uploadToCloud(file, folder, quality) {
    const options = { folder };
    options.resource_type = "auto";

    if (quality) {
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.projectReg = async (req, res) => {
    try {
        
        const { name, description, link, user, tags, githubLink } = req.body;
        
        console.log(req.body);
        
        // Validate GitHub URL if provided
        if (githubLink && githubLink.trim() !== '') {
            const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/?$/;
            if (!githubUrlPattern.test(githubLink)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid GitHub repository URL. Please provide a valid GitHub repository link."
                });
            }
        }
        
        const file = req.files.imgFile;

        

        
        console.log(name, description, link, githubLink);
        


        //upload to cloudinary
        const response = await uploadToCloud(file, "ourProject");
        console.log("This is response", response);

        //get image url
        const image = response.secure_url;

        //send the details to the database
        const project = await Project.create({
            name,
            description,
            githubLink: githubLink && githubLink.trim() !== '' ? githubLink.trim() : null, // Clean and store GitHub link
            image,
            averageRating: 0,
            totalRatings: 0,
            ratings: [],
            user,
            tags
        })
        return res.status(200).json({
            success: true,
            message: "Successfully uploaded the project",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error uploading the project"
        });
    }
}