const display = require('../utils/display.js');

function calculateSummary(result) {
    return {
        totalRelations: result.length,
        totalTestCases: result.reduce((acc, curr) => acc + curr.meta.total, 0),
        failedRelations: result.filter(r => !r.meta.result).length,
        failedTestCases: result.reduce((acc, curr) => acc + curr.meta.failed, 0),
        passedRelations: result.filter(r => r.meta.result).length,
        passedTestCases: result.reduce((acc, curr) => acc + curr.meta.passed, 0),
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