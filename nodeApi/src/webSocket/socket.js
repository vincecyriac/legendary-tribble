const { verify } = require("jsonwebtoken");
const { getUserById } = require("../models/user.model");
module.exports = {
    uiSocket: (io) => {
        // Listen for new connection
        io.on('connection', (socket) => {
            console.log(`New connection ${socket.id}`)
            // const userId = verify(socket.handshake.headers.authorization, process.env.JWT_KEY).id;
            //join room
            socket.on('newMessage', (data) => {
                const userId = verify(data.token, process.env.JWT_KEY, (err, user) => {
                    if (user) {
                        getUserById(user.id, (user, err) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                //send message to all users except sender
                                socket.broadcast.emit('updateMessage', {
                                    self: false,
                                    message: data.data,
                                    name: user[0].name
                                })
                                //send to sender itself
                                socket.emit('updateMessage', {
                                    self: true,
                                    message: data.data,
                                    name: user[0].name
                                })
                            }
                        })
                    }
                    else{
                        console.log(err)
                    }
                });
            });
        });
    },
}