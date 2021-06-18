const Product = require('../models/product');

/*
=====================================
   RENDERIZA PAGE (/admin/add-productS)
=====================================
*/
const getAddProduct = async (req, res, next) => {
  try {
    return res.render('admin/edit-product', {
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
  const { title, imgUrl, price, description } = await req.body;
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
    // solo muestra product q solo pertenescan
    const products = await Product.find({ userId: req.user._id }).populate(
      'userId'
    );
    return res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
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
  const editMode = await req.query.edit;
  const { id } = await req.params;
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
  const { id, title, price, description, imgUrl } = await req.body;
  // const { ...campos } = await req.body;
  try {
    //  const product = await Product.findByIdAndUpdate(id, campos, {
    //     new: true,
    //   });
    const product = await Product.findById(id);
    // q solo el user creador puedo eliminar
    if (product.userId.toString() !== req.user._id.toString()) {
      console.log('You dont have the privileges to edit the product');
      return res.redirect('/');
    }
    product.title = title;
    product.price = price;
    product.description = description;
    product.imgUrl = imgUrl;
    await product.save();
    console.log('Producto actualizado');
    await res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
  }
};
// /*
// =====================================
// ELIMINAR PRODUCTS(de la ruta admin products)
// =====================================
// */
const postDeleteProduct = async (req, res, next) => {
  const { id } = await req.body;
  const product = await Product.findById(id);
  try {
    await Product.deleteOne({ _id: id, userId: req.user._id });
    console.log(product.userId);
    console.log(req.user._id);
    if (product.userId.toString() !== req.user._id.toString()) {
      console.log('You dont have the privileges to delete the product');
      return res.redirect('/admin/products');
    }
    console.log('Producto eliminado');
    return res.redirect('/admin/products');
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
