const display = require('../utils/display.js');

function calculateSummary(result) {
    return {
        totalRelations: result.length,
        totalTestCase: result.map(r => r.testCases.length).reduce((acc, curr) => acc + curr),
        failedRelations: result.filter(r => r.testCases.filter(t => !t.result).length).length,
        failedTestCase: result.reduce((acc, curr) => acc.concat(curr.testCases), []).filter(t => !t.result).length,
    }
}

class TestExecutor {
    static execute(metamorphicTest) {
        Promise.all(metamorphicTest.execute())
            .then(result => {
                result.summary = calculateSummary(result);
                display(result) // display(result)
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = TestExecutor;