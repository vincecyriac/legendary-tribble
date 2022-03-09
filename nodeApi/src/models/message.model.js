//create message model
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    conv_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "conversations"
    },
    message: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    time: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
        required: true
    }
});

//export the model
module.exports = mongoose.model("Message", messageSchema);