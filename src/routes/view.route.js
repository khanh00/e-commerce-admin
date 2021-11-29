const express = require('express');
const viewController = require('../controllers/view.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/', viewController.home);
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/products', authController.protect, viewController.getAllProduct);

module.exports = router;
