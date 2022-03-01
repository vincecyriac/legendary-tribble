const { verify } = require("jsonwebtoken");
const { findUser } = require("../controllers/user.controller");
module.exports = {
    uiSocket: (io) => {
        
        var activeArray = [];
        /* getAllUsers('', (users, err) => {
            if (err) {
                console.log(err);
            }
            else {
                //push name, email, id and active status to activeArray array using for loop
                for (var i = 0; i < users.results.length; i++) {
                    activeArray.push({
                        name: users.results[i].name,
                        email: users.results[i].email,
                        id: users.results[i].id,
                        active: false
                    });
                }
            }
        }) */
        // Listen for new connection
        io.on('connection', (socket) => {
            console.log(`New connection ${socket.id}`)
            const userId = verify(socket.handshake.headers.authorization, process.env.JWT_KEY).id;
            //find user with id User id from array and set active status to true
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
                //find user with id User id from array and set active status to false
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