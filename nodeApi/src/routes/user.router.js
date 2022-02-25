const  { createUser, getAllUsers, getUserById,loginUser } = require('../controllers/user.controller'); 
const router = require('express').Router();
const { validateToken } = require("../auth/tokenValidator")

router.post('/user',validateToken, createUser);
router.post('/login', loginUser);
router.get('/user',validateToken, getAllUsers);
router.get('/user/:id',validateToken, getUserById);


module.exports = router;