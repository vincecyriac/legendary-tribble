const  {  getConvById,createConv,getAllConvs,getMessagesByConvId } = require('../controllers/conversation.controller');
const router = require('express').Router();
const { validateToken } = require("../auth/tokenValidator")

router.get('/', validateToken, getAllConvs);
router.get('/messages/:id', validateToken, getMessagesByConvId);
router.post('/', validateToken, createConv);
router.get('/:id',validateToken, getConvById);


module.exports = router;