const express = require('express');
const viewController = require('../controllers/view.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/login', viewController.login);
router.get('/signup', viewController.signup);

router.get('/', authController.checkIfLoggedIn, viewController.home);
router.get(
  '/products',
  authController.checkIfLoggedIn,
  viewController.getAllProduct
);

module.exports = router;
