const Product = require('../models/product');

/*
=====================================
   RENDERIZA PAGE (/admin/add-productS)
=====================================
*/
const getAddProduct = async (req, res, next) => {
  try {
    await res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
    });
  } catch (error) {
    console.error(error);
  }
};

/*
=====================================
    Crear productos
=====================================
*/

const postAddProduct = async (req, res) => {
  const { title, imgUrl, price, description } = req.body;
  try {
    const product = new Product({
      title,
      imgUrl,
      price,
      description,
      userId: req.user,
    });
    await product.save();
    res.redirect('/admin/products');
    console.log('Created Product');
  } catch (error) {
    console.error(error.stack);
  }
};

/*
=====================================
  Mostrar los product en la ruta(admin products)
  populate.- permite obtener info de 
  los datos relacionados
  primer argumento 
  segundo argumento.- lo q quiero q aparezca
=====================================
*/
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('userId');
    await res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  } catch (error) {
    console.error(error);
  }
};

// /*
// =====================================
// ELIMINAR PRODUCTS(de la ruta admin products)
// =====================================
// */
const postDeleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    await Product.findByIdAndDelete(id);
    console.log('Producto eliminado');
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
  }
};
/*
// =====================================
//     UPDATE PRODUCTS(btn edit)
// =====================================
// */
const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  const { id } = req.params;
  try {
    if (!editMode) {
      return res.redirect('/');
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.redirect('/');
    }
    await res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  } catch (error) {
    console.error(error);
  }
};
// guadar datos actualizados(btn update product)
const postEditProdut = async (req, res) => {
  const { id } = req.body;
  const { ...campos } = req.body;
  try {
    await Product.findByIdAndUpdate(id, campos, {
      new: true,
    });
    await res.redirect('/admin/products');
    console.log('Producto actualizado');
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  postAddProduct,
  getAddProduct,
  getProducts,
  postEditProdut,
  getEditProduct,
  postDeleteProduct,
};
