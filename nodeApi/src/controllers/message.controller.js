const messageSchema = require("../models/message.model");


module.exports = {
    newMessage: (req, res) => {
        console.log(req.loggedUserID);
        const message = new messageSchema({
            message: req.body.message,
            user: req.loggedUserID,
            time: new Date()
        });
        message.save((err, message) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send();
            }
        });

    },
    getAllMessages: (req, res) => {
        messageSchema.aggregate([
            {
                //find all the user with the same id of user in the message
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
                $sort: {
                    time: 1
                }
            }
        ], (err, messages) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(messages);
            }
        });

    }
};


/* 
messageSchema.aggregate([
            {
                //find all the user with the same id of user in the message
                $lookup: {
                    from: "users",
                    localField: "id",
                    foreignField: "user",
                    as: "sender",
                    pipeline: [
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
                $sort: {
                    time: 1
                }
            }
        ], (err, messages) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(messages);
            }
        });   */