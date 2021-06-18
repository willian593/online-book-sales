const express = require('express');
const router = express.Router();
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPass,
  postNewPass,
} = require('../controllers/auth');

router.get('/login', getLogin);
router.post('/login', postLogin);

router.get('/signup', getSignup);
router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.get('/reset', getReset);
router.post('/reset', postReset);
router.get('/reset/:token', getNewPass);
router.post('/new-password', postNewPass);

module.exports = router;
