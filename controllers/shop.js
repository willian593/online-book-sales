const Product = require('../models/product');
const Order = require('../models/order');

/*
=====================================
   PAGINA SHOP (Mostrar productos)
=====================================
*/
const getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    await res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (error) {
    console.error(error);
  }
};
/*
=====================================
         ALL PRODUCTS
=====================================
*/
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    await res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (error) {
    console.error(error);
  }
};
/*
=====================================
 GET SOLO UN PRODUCTO X ID (btn detalles)
=====================================
*/
const getProduct = async (req, res) => {
  const { id } = await req.params;
  try {
    const product = await Product.findById(id);
    await res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  } catch (error) {
    console.error(error);
  }
};
/*
=====================================
 MOSTRAR PRODUCTOS ruta /cart
=====================================
*/
const getCart = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();
  try {
    const products = user.cart.items;
    await res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your cart',
      products: products,
    });
  } catch (error) {
    console.error(error);
  }
};

/*
=====================================
 MOSTRAR PEDIDOS (ruta /orders)
=====================================
*/
const getOrders = async (req, res, next) => {
  const orders = await Order.find({ 'user.userId': req.user._id });
  await res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
    orders,
  });
};

/*
=====================================
 Nuevos productos al cart (btn add to cart)
 ruta /products
=====================================
*/
const postCart = async (req, res, next) => {
  const prodId = await req.body.id;
  try {
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
    console.log('Producto agregado al carro');
    await res.redirect('/cart');
  } catch (error) {
    console.error(error);
  }
};

/*
=====================================
 ELIMINAR PRODUCT DEL CART (btn delete) ruta /cart
=====================================
*/
const postCartDeleteProduct = async (req, res) => {
  const { id } = await req.body;
  try {
    const result = await req.user;
    await result.removeFromCart(id);
    console.log('Producto eliminado del carrito');
    await res.redirect('/cart');
  } catch (error) {
    console.error(error);
  }
};

/*
=====================================
 Comprar producto (btn order now - ruta/cart )
=====================================
*/
const postOrder = async (req, res) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();

  try {
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products: products,
    });
    await order.save();
    await req.user.clearCart();
    console.log('Pedido finalizado');
    await res.redirect('/orders');
  } catch (error) {
    console.error(error.stack);
  }
};

module.exports = {
  getProducts,
  getIndex,
  getOrders,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
};
