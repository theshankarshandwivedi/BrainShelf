const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
    mongoose.connect(process.env.MONGO_URL)

.then(()=>{
    console.log("Connected successfully with database");
    console.log("Hey there");
})
.catch((err) => {
    console.log(err);
    console.log("error connecting to database");
    process.exit(1);
})
}

module.exports = connect;