const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.registerControll = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, username } = req.body;
        console.log({
            name: name,
            email: email,
            passwd: password,
            cnf: confirmPassword
        })
        // console.log(name, email, password, confirmPassword);
        if (!name || !email || !password || !confirmPassword || !username) {
            return res.status(401).json({
                success: false,
                message: "Fill out every fields"
            })
        }

        console.log("recieved everything");
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Passwords did not match",
            })
        }
        console.log("password matched");
        const getUser = await User.findOne({email: email});
        if(getUser){
            return res.status(402).json({
                success: false,
                message: "User already registered",
            })
        }
        console.log("this is a new user");
        // const hashedPass = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            username,
            email,
            password,
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully"
        });

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error in user registration. Please try again"
        });
    }
}