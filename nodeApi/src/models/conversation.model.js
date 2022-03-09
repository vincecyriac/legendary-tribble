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
    },
    group  : {
        type: mongoose.Schema.Types.Number,
        required: true,
        default: 0
    },
    groupName : {
        type: mongoose.Schema.Types.String,
        required: true,
        default: null
    }
});

module.exports = mongoose.model("Conversation", convScheme);
