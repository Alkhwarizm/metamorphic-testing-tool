const {
    displayExecution, 
    displayReport
} = require('../utils/display.js');

function calculateSummary(result) {
    const details = result.map((item, idx) => {
        return {
            relation: {
                description: item.relation.description,
                idx
            },
            testCases: item.meta.total,
            failed: item.meta.failed,
            passed: item.meta.passed,
        }
    });
    return {
        totalRelations: result.length,
        totalTestCases: result.reduce((acc, curr) => acc + curr.meta.total, 0),
        failedRelations: result.filter(r => !r.meta.result).length,
        failedTestCases: result.reduce((acc, curr) => acc + curr.meta.failed, 0),
        passedRelations: result.filter(r => r.meta.result).length,
        passedTestCases: result.reduce((acc, curr) => acc + curr.meta.passed, 0),
        details,
    }
}

class TestExecutor {
    static execute(metamorphicTest) {
        displayExecution(metamorphicTest.aut, metamorphicTest.mrs);
        Promise.all(metamorphicTest.execute())
            .then(result => {
                result.summary = calculateSummary(result);
                displayReport(result) 
            })
            .catch(err => {
                console.log(err);
            });
    }

    static executeAll(metamorphicTests) {

    }
}

module.exports = TestExecutor;