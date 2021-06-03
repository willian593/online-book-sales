const mongoose = require('mongoose');
const User = require('../models/user');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('DB Online');
    // await CreateUser();
  } catch (error) {
    console.error(error);
    throw new Error('Error a la hora de iniciar la BD ver logs');
  }
};

async function CreateUser() {
  const verificarUser = User.findOne();
  try {
    if (!verificarUser) {
      const user = new User({
        name: 'Max',
        email: 'admin@gmail.com',
        cart: {
          items: [],
        },
      });
      user.save();
    }
  } catch (error) {
    console.error(error.stack);
    throw new Error('Usuario ya existe');
  }
}

module.exports = {
  dbConnection,
};
