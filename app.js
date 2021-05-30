const path = require('path');
const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./util/conexion-db');
const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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

/*
=====================================
       MIDDLEWARE USER
=====================================
*/

app.use((req, res, next) => {
  User.findById('60b298087a089007944ac93d')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

/*
=====================================
       ROUTER
=====================================
*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

/*
=====================================
       CONECTION SERVICE and DB
=====================================
*/
dbConnection();
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
