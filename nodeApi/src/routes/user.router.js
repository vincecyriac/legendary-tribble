const  { createUser, getAllUsers, getUserById, loginUser, getCurrentUser } = require('../controllers/user.controller'); 
const router = require('express').Router();
const { validateToken } = require("../auth/tokenValidator")

router.post('/user', createUser);
router.post('/login', loginUser);
router.get('/user',validateToken, getAllUsers);
router.get('/user/:id',validateToken, getUserById);
router.get('/me',validateToken, getCurrentUser);


module.exports = router;