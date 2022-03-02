const  {  getAllUsers,loginUser,createUser,getUserById,getCurrentUser,refreshToken } = require('../controllers/user.controller'); 
const router = require('express').Router();
const { validateToken,validateRefreshToken } = require("../auth/tokenValidator")

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/refreshToken',validateRefreshToken, refreshToken);
router.get('/',validateToken, getAllUsers);
router.get('/me',validateToken, getCurrentUser);
router.get('/:id',validateToken, getUserById);


module.exports = router;