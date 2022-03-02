const  {loginUser,refreshToken } = require('../controllers/user.controller'); 
const router = require('express').Router();
const { validateRefreshToken } = require("../auth/tokenValidator")

router.post('/login', loginUser);
router.post('/refreshToken',validateRefreshToken, refreshToken);


module.exports = router;