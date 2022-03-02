const  {  newMessage,getAllMessages} = require('../controllers/message.controller'); 
const router = require('express').Router();
const { validateToken } = require("../auth/tokenValidator")

router.post('/',validateToken, newMessage);
router.get('/',validateToken, getAllMessages);


module.exports = router;