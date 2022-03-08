const convSchema = require('../models/conversation.model');
const mongoose = require("mongoose");

module.exports = {
    getConvById: (req, res) => {
        convSchema.findById(req.params.id, (err, conv) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(conv);
            }
        });
    },
    createConv: (req, res) => {
        if (!req.body.users || req.body.users.length != 2) {
            res.status(400).send({
                message: "Please provide 2 users"
            });
        }
        else {
            const conv = new convSchema({
                users: req.body.users,
                lastUpdate: new Date()
            });
            conv.save((err, conv) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(conv);
                }
            });
        }
    },
    getAllConvs: (req, res) => {
        console.log(req.loggedUserID);
        convSchema.aggregate([
            {
                $lookup: {
                    from: "users",
                    let: {
                        user: "$users"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$user"] 
                                },
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1
                            }
                        }
                    ],
                    as: "users"
                },
            },
            {
                $match: {
                    $expr: {
                        $in: [mongoose.Types.ObjectId(req.loggedUserID), "$users._id"]
                    }
                }
            }
        ]).exec((err, convs) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(convs);
            }
        });
    },
    getMessagesByConvId: (req, res) => {
        convSchema.aggregate([
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'conv_id',
                    as: 'messages',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'user',
                                foreignField: '_id',
                                as: 'sender',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            name: 1,
                                            email: 1
                                        }
                                    }
                                ]
                            },
                        },
                    ]
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
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
}   