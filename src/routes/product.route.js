const express = require('express');
const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.checkIfLoggedIn);
router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.uploadImages, productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.uploadImages, productController.updateProduct)
  .delete(authController.checkIfAdmin, productController.deleteProduct);

module.exports = router;
