const  {  newMessage} = require('../controllers/message.controller'); 
const router = require('express').Router();
const { validateToken } = require("../auth/tokenValidator")

router.post('/',validateToken, newMessage);


module.exports = router;