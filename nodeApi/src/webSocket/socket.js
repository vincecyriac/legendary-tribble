const { verify } = require("jsonwebtoken");
const userSchema = require("../models/user.model");

module.exports = {
    uiSocket: (io) => {
        var activeArray = [];
        userSchema.find({}, (err, users) => {
            if (err) {
                console.log(err);
            }
            else {
                for (var i = 0; i < users.length; i++) {
                    activeArray.push({
                        name: users[i].name,
                        email: users[i].email,
                        id: users[i].id,
                        active: false
                    });
                }
            }
        })

        // Listen for new connection
        io.on('connection', (socket) => {
            console.log(`New connection ${socket.id}`)
            const userId = verify(socket.handshake.headers.authorization, process.env.JWT_KEY).id;
            for (var i = 0; i < activeArray.length; i++) {
                if (activeArray[i].id == userId) {
                    activeArray[i].active = true;
                    io.emit('activeUsers', activeArray);
                    break;
                }
            }
            //listen for disconnect
            socket.on('disconnect', () => {
                console.log(`Disconnected ${socket.id}`)
                for (var i = 0; i < activeArray.length; i++) {
                    if (activeArray[i].id == userId) {
                        activeArray[i].active = false;
                        io.emit('activeUsers', activeArray);
                        break;
                    }
                }
            });
        });
    },
}