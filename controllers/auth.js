const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const { uppercaseLetters, lowercaseLetters } = require('../util/helpers');
const { response, request } = require('express');

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_USERNAME,
    },
  })
);
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

    // send an email
    await transporter.sendMail({
      to: emailMinuscula,
      from: 'natalia000096@hotmail.com',
      subject: 'Hi there',
      text: 'Su registro se ha realizado satisfactoriamente',
      html: '<b>Su registro se ha realizado satisfactoriamente</b>',
    });

    await res.redirect('/login');
    console.log('Usuario creado');
  } catch (error) {
    console.error(error.stack);
  }
};

/*
=====================================
 RESET PASS (render pagina)
=====================================
*/

const getReset = async (req, res) => {
  let message = req.flash('error');
  try {
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    await res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage: message,
    });
  } catch (error) {
    console.error(error.stack);
  }
};
/*
=====================================
  (btn reset password)
=====================================
*/

const postReset = async (req, res = response) => {
  const { email } = req.body;
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      // verificar si existe email
      const user = await User.findOne({ email });
      if (!user) {
        req.flash(`Error, No se encontro el correo $ {user.email}`);
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExp = Date.now() + 3600000;
      await user.save();
      await transporter.sendMail({
        to: email,
        from: 'natalia000096@hotmail.com',
        subject: 'Restablecer contraseña',
        html: `
            <p>Solicitaste un restablecimiento de contraseña</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
      });
      res.redirect('/');
    });
  } catch (error) {
    console.error(error.stack);
  }
};

/*
=====================================
  RENDER PAGE NEW-PASS
=====================================
*/

const getNewPass = async (req, res) => {
  let message = await req.flash('error');
  const { token } = await req.params;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    console.log('Restablecer contraseña');
    return res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    console.error(error.stack);
  }
};
/*
=====================================
   ACTUALIZAR EL PASS
=====================================
*/
const postNewPass = async (req, res) => {
  const { password, userId, passwordToken } = await req.body;
  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExp: { $gt: Date.now() },
      _id: userId,
    });
    const salt = bcrypt.genSaltSync();
    // actualizar DB
    user.password = bcrypt.hashSync(password, salt);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();
    console.log('Password Update');
    return res.redirect('/login');
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
  getReset,
  postReset,
  getNewPass,
  postNewPass,
};
