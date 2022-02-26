const { genSaltSync, hashSync,compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { createUser, getAllUsers, getAdminByUsername,getUserById } = require("../models/user.model");


module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    createUser(body, (err, data) => {
      if (err) {
        res.status(403).json(err);
      } else {
        res.status(200).json();
      }
    });
  },

  getCurrentUser: (req, res) => {
    getUserById(req.loggedUserID, (data, err) => {
      if (err) {
        res.status(403).json(err);
      } else {
        res.status(200).json(data);
      }
    });
  },

  getAllUsers: (req, res) => {
    getAllUsers(req.query, (data, err) => {
      if (err) {
        res.status(500).json({
          errorMessage: "Bad request",
        });
      } else {
        res.status(200).json(data);
      }
    });
  },

  getUserById: (req, res) => {
    const id = req.params.id;
    getUserById(id, (data, err) => {
      if (err) {
        res.status(403).json(err);
      } else if (data.length === 0) {
        res.status(404).json({
          errorMessage: "User not found",
        });
      } else {
        res.status(200).json(data[0]);
      }
    });
  },

  loginUser: (req, res) => {
    const body = req.body;
    if(!req.body.email || !req.body.password){
      res.status(400).json({
        errorMessage: "Invalid credentials",
      });
    }
    else{
      getAdminByUsername(body.email, (data, err) => {
        if (err) {
          res.status(403).json(err);
        } else if (data.length === 0) {
          res.status(403).json({
            errorMessage: "Invalid credentials",
          });
        } else {
          const result = compareSync(body.password, data[0].password);
          if (result) {
            const accesstoken = sign(
              {
                id: data[0].id,
                userName: data[0].userName,
              },
              process.env.JWT_KEY,
              { expiresIn: "30d" }
            );
  
            const refreshtoken = sign(
              {
                id: data[0].id,
                userName: data[0].userName,
              },
              process.env.JWT_KEY,
              { expiresIn: "100d" }
            );
  
            res.status(200).json({
              accessToken: accesstoken,
              refreshToken: refreshtoken,
            });
          } else {
            res.status(403).json({
              errorMessage: "Invalid credentials",
            });
          }
        }
      });
    }
    
  },
};
