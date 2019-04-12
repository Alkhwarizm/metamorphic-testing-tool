const _ = require('lodash');

function isEquivalent(outputs) {
    const source = outputs[0];
    return _.drop(outputs).every(foll => {
        return source.length === foll.length && _(source).differenceWith(foll, _.isEqual).isEmpty();
    });
}

function isEqual(outputs) {
    return _.drop(outputs).every(foll => _.isEqual(outputs[0], foll));
}

function isSubset(outputs) {
    return outputs.reduce((acc, curr, idx, arr) => {
        return idx < arr.length-1
            ? acc && _(arr[idx+1]).differenceWith(curr, _.isEqual).isEmpty()
            : acc;
    }, true);
}

function isDisjoint(outputs) {
    const result = _.drop(outputs).every(foll => {
        return _(outputs[0]).intersectionWith(foll, _.isEqual).isEmpty();
    })
    return result;
}

function isComplete(outputs) {
    const union = _.unionWith(..._.drop(outputs), _.isEqual);
    return _(outputs[0]).differenceWith(union, _.isEqual).isEmpty();
}

function isDifferent(outputs, difference) {
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