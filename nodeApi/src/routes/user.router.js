const  {  getAllUsers,loginUser,createUser,getUserById } = require('../controllers/user.controller'); 
const router = require('express').Router();
// const { validateToken } = require("../auth/tokenValidator")

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);


module.exports = router;