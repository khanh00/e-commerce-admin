const express = require('express');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.checkIfLoggedIn, authController.logout);

router
  .route('/')
  .get(authController.checkIfLoggedIn, userController.getAllUsers)
  .post(authController.checkIfLoggedIn, userController.createUser);
router
  .route('/:id')
  .get(authController.checkIfLoggedIn, userController.getUser)
  .patch(authController.checkIfLoggedIn, userController.updateUser)
  .delete(authController.checkIfLoggedIn, userController.deleteUser);

module.exports = router;
