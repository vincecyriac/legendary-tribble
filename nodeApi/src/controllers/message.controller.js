const messageSchema = require("../models/message.model");


module.exports = {
    newMessage: (req, res) => {
        const message = new messageSchema({
            message: req.body.message,
            user: req.body.user,
            time: new Date()
        });
        message.save((err, message) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(message);
            }
        });

    },
    getAllMessages: (req, res) => {
        messageSchema.aggregate([
            {
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
                    ]
                },                
            },
            {
                $sort: {
                    time: 1
                }
            }
        ], (err, messages) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(messages);
            }
        });
    }
};