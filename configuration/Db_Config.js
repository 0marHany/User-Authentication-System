const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(process.env.MONGO_CONNECTION)
        .then((result) => {
            console.log("DbConnected");
        })
        .catch((error) => {
            console.log(error.message);
        })
}