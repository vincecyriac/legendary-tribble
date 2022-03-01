const { verify } = require("jsonwebtoken");
const { checkUserAvail } = require("../controllers/user.controller");

module.exports = {
    validateToken: (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) {
            return res.status(401).json({
                errorMessage: "Invalid Token",
            });
        }
        verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({
                    errorMessage: "Invalid Token",
                });
            }
            else{
                checkUserAvail(user.email, (user, err) => {
                    if (err) {
                        return res.status(401).json({
                            errorMessage: "Invalid Token",
                        });
                    }
                    else {
                        req.loggedUserID = user.id;
                        next();
                    }
                });
            }
        });
    },
    //validate refresh token
    validateRefreshToken: (req, res, next) => {
        const token = req.body.refreshToken;
        if (token == null) {
            return res.status(403).json({
                errorMessage: "Invalid Token",
            });
        }
        verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({
                    errorMessage: "Invalid Token",
                });
            }
            else{
                checkUserAvail(user.email, (user, err) => {
                    if (err) {
                        return res.status(403).json({
                            errorMessage: "Invalid Token",
                        });
                    }
                    else {
                        req.loggedUser = user;
                        next();
                    }
                });
            }
        });
    }
};