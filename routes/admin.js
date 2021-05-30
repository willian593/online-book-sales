// /admin/...
const express = require('express');
const router = express.Router();
const {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProdut,
  postDeleteProduct,
} = require('../controllers/admin');

router.get('/add-product', getAddProduct);

router.get('/products', getProducts);

router.post('/add-product', postAddProduct);

router.get('/edit-product/:id', getEditProduct);

router.post('/edit-product', postEditProdut);

router.post('/delete-product', postDeleteProduct);

module.exports = router;
