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

const { isAuth } = require('../middleware/is-auth');

router.get('/add-product', isAuth, getAddProduct);

router.get('/products', isAuth, getProducts);

router.post('/add-product', isAuth, postAddProduct);

router.get('/edit-product/:id', isAuth, getEditProduct);

router.post('/edit-product', isAuth, postEditProdut);

router.post('/delete-product', isAuth, postDeleteProduct);

module.exports = router;
