//instantiating express

const express = require("express");
const app = express();

//loading dotenv to process
require("dotenv").config();

//cors middleware
const cors = require("cors");

// CORS configuration using environment variables
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variables
    const allowedOrigins = [
      process.env.FRONTEND_URL,                   // Frontend URL from environment
    ].filter(Boolean); // Remove any undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

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