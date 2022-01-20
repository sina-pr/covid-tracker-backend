const router = require('express').Router();
const auth = require('../auth');
const userModel = require('../models/users/usersModel');

router.post('/login', userModel.loginAdmin);

//private routes
router.post('/', auth.authenticateSuperUser, userModel.createNewAdmin);

module.exports = router;
