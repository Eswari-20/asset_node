const express = require('express');
const router = express.Router();
const authCtrl = require('../../modules/auth/controller/authCtrl');

router.post('/login', authCtrl.loginCtrl);
router.post('/forgot-password', authCtrl.forgotPasswordCtrl);


module.exports = router;