const express = require('express'); //Import express
const router = express.Router(); //Import express.Routes em 'router'

const authController = require('../controllers/authController'); //Import função de registros e login de usuários.

router.post('/register', authController.register); //Envia dados p/ função register
router.post('/login', authController.login); //Envia dados p/ função login

module.exports = router;
