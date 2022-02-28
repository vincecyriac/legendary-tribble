//create message model
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    }
});

//export the model
module.exports = mongoose.model("Message", messageSchema);