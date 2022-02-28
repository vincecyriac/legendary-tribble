const  {  newMessage,getAllMessages} = require('../controllers/message.controller'); 
const router = require('express').Router();
// const { validateToken } = require("../auth/tokenValidator")

router.post('/', newMessage);
router.get('/', getAllMessages);


module.exports = router;