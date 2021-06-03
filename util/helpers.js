/*
=====================================
 letras en mayusculas
=====================================
*/
const uppercaseLetters = async (word) => {
  return word
    .toLowerCase()
    .split(' ')
    .map((letter) => letter[0].toUpperCase() + letter.slice(1))
    .join(' ');
};
/*
=====================================
 letras en minusculas
=====================================
*/

const lowercaseLetters = async (word) => {
  return word.toLowerCase();
};

module.exports = {
  uppercaseLetters,
  lowercaseLetters,
};
