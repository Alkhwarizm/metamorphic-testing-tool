const {
    displayExecution, 
    displayReport,
    displaySummary
} = require('../utils/display.js');

function getExecutionSummary(results) {
    
}

function getTestSummary(result) {
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
    const overview = {
        totalRelations: result.length,
        totalTestCases: result.reduce((acc, curr) => acc + curr.meta.total, 0),
        failedRelations: result.filter(r => !r.meta.result).length,
        failedTestCases: result.reduce((acc, curr) => acc + curr.meta.failed, 0),
        passedRelations: result.filter(r => r.meta.result).length,
        passedTestCases: result.reduce((acc, curr) => acc + curr.meta.passed, 0),
    }
    return {
        overview,
        details,
    }
}

class TestExecutor {
    static execute(metamorphicTest) {
        displayExecution(metamorphicTest.aut, metamorphicTest.mrs);
        return Promise.all(metamorphicTest.execute())
            .then(result => {
                result.summary = getTestSummary(result);
                return result;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static async displayTestReport(report) {
        try {
            displayReport(await report);
            // displaySummary()
        } catch (err) {
            console.log(err);
        }
    }

    static executeAll(metamorphicTests) {
        const report = metamorphicTests.map(test => {
            return Promise.all(test.execute())
                .then(result => {
                    result.summary = getTestSummary(result);
                    return result;
                })
                .catch(err => {
                    console.log(err);
                })
        });
    }
}

module.exports = TestExecutor;