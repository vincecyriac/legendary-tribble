const { verify } = require("jsonwebtoken");
const userSchema = require("../models/user.model");

module.exports = {
    uiSocket: (io) => {
        // Listen for new connection
        io.on('connection', (socket) => {
            console.log(`New connection ${socket.id}`)
            //listen for disconnect
            //listen for join room event
            socket.on('join', (data) => {
                console.log("Someone Joined  room :"+ data.data);
                socket.join(data.data);
            });
            //listen for leave room event
            socket.on('leave', (data) => {
                console.log("Someone left  room :"+ data.data);
                socket.leave(data.data);
            });
            socket.on('disconnect', () => {
                console.log(`Disconnected ${socket.id}`)
            });
        });
    },
}