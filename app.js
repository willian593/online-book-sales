const path = require('path');
const express = require('express');
require('dotenv').config();
const session = require('express-session');
const csrf = require('csurf');

// para ver las sessiones
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: process.env.DB_CNN,
  collection: 'sessions', // nombre como se guarda en la db
});

const crsfProteccion = csrf();
const { dbConnection } = require('./util/conexion-db');
const errorController = require('./controllers/error');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 8080;

/*
=====================================
       MOTOR DE PLANTILLA
=====================================
*/

app.set('view engine', 'ejs');
app.set('views', 'views');

/*
=====================================
       MIDDLEWARE
=====================================
*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(crsfProteccion);

/*
=====================================
       MIDDLEWARE USER
=====================================
*/

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

/*
=====================================
       ROUTER
=====================================
*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

/*
=====================================
 CONECTION SERVICE, mongoDB 
=====================================
*/

dbConnection();
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
