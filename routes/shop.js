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

const { isAuth } = require('../middleware/is-auth');

router.get('/', getIndex);

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);
router.post('/cart-delete-item', isAuth, postCartDeleteProduct);
router.post('/create-order', isAuth, postOrder);

router.get('/orders', isAuth, getOrders);

module.exports = router;
