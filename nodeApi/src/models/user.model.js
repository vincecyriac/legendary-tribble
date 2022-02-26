const pool = require("../../config/database");

module.exports = {
  //create new user
  createUser: (data, callback) => {
    pool.query(
      "SELECT email FROM `users` WHERE email = ?;",
      [data.email],
      (error, results, fields) => {
        if (error) {
          return callback({
            errorMessage: "Bad request",
          });
        }
        if (results.length > 0) {
          return callback({
            errorMessage: "User already exists",
          });
        } else {
          pool.query(
            "INSERT INTO `users` ( `email`, `name`, `password`) VALUES (?,?,?);",
            [
              data.email,
              data.name,
              data.password
            ],
            (error, results, fields) => {
              if (error) {
                return callback(error);
              }
              return callback(null, results);
            }
          );
        }
      }
    );
  },

  //get all users
  getAllUsers: (pagination, callback) => {
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 1000000;
    const offset = (page - 1) * limit;
    pool.query(
      "SELECT id,email,name,createdAt,updatedAt FROM `users` LIMIT ?,?",
      [offset, limit],
      (error, results, fields) => {
        returnData = {
          page: page,
          limit: limit,
          results: results,
        };
        if (error) {
          return callback(error);
        }
        return callback(returnData);
      }
    );
  },

  //get user by id
  getUserById: (id, callBack) => {
    pool.query(
      "SELECT id,name,email, createdAt, UpdatedAt FROM users WHERE id= ?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(results[0]);
      }
    );
  },
  //get user by email
  getAdminByUsername: (email, callback) => {
    pool.query(
      "SELECT * FROM `users` WHERE email = ?",
      [email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(results);
      }
    );
  },
  
};
