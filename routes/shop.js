const express = require('express');
const router = express.Router();
const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  postOrder,
} = require('../controllers/shop');

router.get('/', getIndex);

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/cart', getCart);

router.post('/cart', postCart);
router.post('/cart-delete-item', postCartDeleteProduct);
router.post('/create-order', postOrder);

router.get('/orders', getOrders);

module.exports = router;
