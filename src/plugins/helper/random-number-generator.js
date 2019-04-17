function getRandomProbability() {
  return Math.random();
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  const factor = Math.floor(max) - Math.ceil(min);
  const offset = Math.floor(min);
  return Math.floor(Math.random() * factor) + offset;
}

module.exports = {
  getRandomProbability,
  getRandomFloat,
  getRandomInt,
};
