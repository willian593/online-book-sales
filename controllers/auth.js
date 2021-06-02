const User = require('../models/user');
/*
=====================================
 MOSTRAR PAGE LOGIN
=====================================
*/
const getLogin = async (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[3].trim().split('=')[1];
  await res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};
/*
=====================================
 BTN LOGIN
=====================================
*/
const postLogin = async (req, res, next) => {
  const user = await User.findById('60b298087a089007944ac93d');
  try {
    req.session.isLoggedIn = true;
    req.session.user = user;
    // await req.session.save();
    await res.redirect('/');
  } catch (error) {
    console.error(error.stack);
  }
};

/*
=====================================
 BTN LOGOUT (cerrar session)
=====================================
*/

const postLogout = async (req, res) => {
  try {
    await req.session.destroy();
    await res.redirect('/');
  } catch (error) {
    console.error(error.stack);
  }
};
module.exports = { getLogin, postLogin, postLogout };
