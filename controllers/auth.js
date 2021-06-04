const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { uppercaseLetters, lowercaseLetters } = require('../util/helpers');
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
 iniciar session  BTN LOGIN
=====================================
*/
const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existEmail = await User.findOne({ email });
    if (!existEmail) {
      res.redirect('/login');
      console.log(`Email no encontrado`);
    }
    // verificar contraseña
    const validarPass = bcrypt.compareSync(password, existEmail.password);
    if (validarPass) {
      req.session.isLoggedIn = true;
      req.session.user = existEmail;
      // await req.session.save();
      await res.redirect('/');
      console.log(`Pass válido`);
    }
    await res.redirect('/login');
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

/*
=====================================
 Registrase (signup)
=====================================
*/

const getSignup = async (req, res) => {
  try {
    await res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
    });
  } catch (error) {
    console.error(error.stack);
  }
};
/*
=====================================
 CREAR USUARIO (con email, pass)
=====================================
*/
const postSignup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    // ver q email no este duplicado
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      await res.redirect('/signup');
      console.log(`El correo ${existEmail.email} ya está registrado`);
    }

    const usuario = new User(req.body);

    // encriptar pass
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // email minusculas
    usuario.email = await lowercaseLetters(usuario.email);

    await usuario.save(); //=> Guardando el new user
    await res.redirect('/login');
    console.log('Usuario creado');
  } catch (error) {
    console.error(error.stack);
  }
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
};
