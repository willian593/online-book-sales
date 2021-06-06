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
  let message = req.flash('error');
  try {
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    await res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message,
    });
  } catch (error) {
    console.error(error.stack);
  }
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
      await req.flash('error', 'Email o pass invalidos');
      console.log(`Email no encontrado`);
      return res.redirect('/login');
    }
    // verificar contraseña
    const validarPass = bcrypt.compareSync(password, existEmail.password);
    if (validarPass) {
      req.session.isLoggedIn = true;
      req.session.user = existEmail;
      // await req.session.save();
      console.log(`Iniciaste sesión con ${existEmail.email}`);
      return res.redirect('/');
    }
    await req.flash('error', 'Pass o email invalidos');
    return res.redirect('/login');
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
  let message = req.flash('error');
  try {
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    await res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
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
  // email minusculas
  const emailMinuscula = await lowercaseLetters(email);
  try {
    // ver q email no este duplicado
    const existEmail = await User.findOne({ email: emailMinuscula });
    if (existEmail) {
      await req.flash(
        'error',
        `El correo ${existEmail.email} ya está registrado`
      );
      console.log(`El correo ${existEmail.email} ya está registrado`);
      return res.redirect('/signup');
    }

    const usuario = new User(req.body);

    // encriptar pass
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

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
