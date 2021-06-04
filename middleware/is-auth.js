// Proteger las rutas
const isAuth = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    await res.redirect('/login');
  }
  next();
};

module.exports = { isAuth };
