const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const userSchema = require("../models/user.model");


module.exports = {

    getAllUsers: (req, res) => {
        userSchema.find({}, (err, users) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(users);
            }
        });

    },
    loginUser: (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).send({
                message: "Please provide email and password"
            });
        }
        else{
            userSchema.findOne({
                email: req.body.email
            }, (err, user) => {
                if (err) {
                    res.status(500).send(err);
                } else if (!user) {
                    res.status(404).send({
                        message: "User not found"
                    });
                } else {
                    const result = compareSync(req.body.password, user.password);
                    console.log(user.id);
                    if (compareSync(req.body.password, user.password)) {
                        const accesstoken = sign(
                            {
                              id: user.id,
                              email: user.email,
                            },
                            process.env.JWT_KEY,
                            { expiresIn: "30d" }
                          );
                
                          const refreshtoken = sign(
                            {
                              id: user.id,
                              userName: user.email,
                            },
                            process.env.JWT_KEY,
                            { expiresIn: "100d" }
                          );
                
                          res.status(200).json({
                            accessToken: accesstoken,
                            refreshToken: refreshtoken,
                          });
                    } else {
                        res.status(403).send({
                            message: "Invalid password"
                        });
                    }
                }
            });
        }
    },

    createUser: (req, res) => {
        const salt = genSaltSync(10);
        req.body.password = hashSync(req.body.password, salt);
        const user = new userSchema({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        user.save((err, user) => {
            if (err) {
                res.status(403).send(err);
            } else {
                res.status(200).send(user);
            }
        });
    },
    getUserById: (req, res) => {
        userSchema.findById(req.params.id, (err, user) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(user);
            }
        });
    },
    // getCurrentUser
};