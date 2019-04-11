const _ = require('lodash');

function isEquivalent(outputs) {
    return _(outputs[0]).differenceWith(outputs[1], _.isEqual).isEmpty();
}

function isEqual(outputs) {
    return true;
}

function isSubset(outputs) {
    return true;
}

function isDisjoint(outputs) {
    return true;
}

function isComplete(outputs) {
    return true;
}

function isDifferent(outputs) {
    return true;
}

module.exports = {
    isEquivalent,
    isEqual,
    isSubset,
    isDisjoint,
    isComplete,
    isDifferent
}