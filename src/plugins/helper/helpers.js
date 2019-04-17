const rng = require('./random-number-generator');
const patterns = require('./metamorphic-relation-patterns');

function chooseRandomElement(array) {
  return array[rng.getRandomInt(0, array.length)];
}

module.exports = {
  ...patterns,
  ...rng,
  chooseRandomElement,
};
