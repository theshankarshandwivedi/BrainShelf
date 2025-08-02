const cloudinary = require("cloudinary");

exports.cloudinaryConnect = () => {
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });

        console.log("Connected to the cloudinary succesfully");

    }catch(error){
        console.log(error);
        console.log("Could not connect to cloudinary");
    }
}