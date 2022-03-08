const messageSchema = require("../models/message.model");


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
                io.emit('updateMessage', {
                    id: message.id,
                    message: req.body.message,
                    time: new Date(),
                    sender: {
                        _id: req.loggedUserID,
                        name: req.loggedUser.name,
                        email: req.loggedUser.email
                    }
                })
                res.status(200).send();
            }
        });

    },
    getAllMessages: (req, res) => {
        messageSchema.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: {
                        user: "$user"
                    },
                    as: "sender",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$user"]
                                }
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1
                            }
                        }
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    message: 1,
                    time: 1,
                    sender: {
                        $arrayElemAt: ["$sender", 0]
                    }
                }
            },
            {
                $sort: {
                    time: 1
                },
            },
        ], (err, messages) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(messages);
            }
        });

    }
};