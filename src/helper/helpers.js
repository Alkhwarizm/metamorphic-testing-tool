const {
    getRandomFloat,
    getRandomInt,
    getRandomProbability
} = require('./random-number-generator');

function chooseRandomElement(array) {
    return array[getRandomInt(0, array.length)];
}

module.exports = {
    getRandomFloat,
    getRandomInt,
    getRandomProbability,
    chooseRandomElement,
}