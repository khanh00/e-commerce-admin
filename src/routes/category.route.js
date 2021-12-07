const express = require('express');
const categoryController = require('../controllers/category.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
