//instantiating express

const express = require("express");
const app = express();

//loading dotenv to process
require("dotenv").config();

//cors middleware
const cors = require("cors");
app.use(cors());

//using middleware of json
app.use(express.json());

//fileUpload
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

//connecting to database
const connect = require("./config/Database");
connect();

//connect to cloudinary
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//importing the routers
const user = require("./routes/Routers");
app.use("/api/v1", user);

//starting the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`App started at port no ${process.env.PORT || 3000}`);
    app.get("/", (req, res) => {
        res.send("Welcome to BrainShelf API");
    });
});