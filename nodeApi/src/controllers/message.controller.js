const messageSchema = require("../models/message.model");
const convSchema = require("../models/conversation.model");

module.exports = {
    newMessage: (req, res) => {
        const message = new messageSchema({
            conv_id: req.body.conv_id,
            message: req.body.message,
            user: req.loggedUserID,
            time: new Date()
        });
        message.save((err, message) => {
            if (err) {
                res.status(500).send(err);
            } else {
                //update last update in conversation model
                convSchema.findByIdAndUpdate(
                    req.body.conv_id,
                    {
                        $set: {
                            lastUpdate: new Date()
                        }
                    },
                    (err, conv) => {
                        if (err) {
                            res.status(200).send();
                        } else {
                            io.to(req.body.conv_id).emit('updateMessage', {
                                id: message.id,
                                conv_id: req.body.conv_id,
                                message: req.body.message,
                                time: new Date(),
                                sender: [{
                                    _id: req.loggedUserID,
                                    name: req.loggedUser.name,
                                    email: req.loggedUser.email
                                }]
                            })
                            res.status(200).send();
                        }
                    }
                );

            }
        });

    },
};