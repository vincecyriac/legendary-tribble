//create message model
const mongoose = require("mongoose");
const convScheme = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }],
    lastUpdate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model("Conversation", convScheme);
