const {
    displayExecution, 
    displayReport,
    displaySummary
} = require('../utils/display.js');

function getExecutionSummary(results) {
    const details = results.map((result, idx) => {
        return {
            test: {
                idx: idx+1,
                target: result.target,
            },
            relations: result.summary.details,
            overview: result.summary.overview,
        }
    });
    const overview = {
        totalTests: details.length,
        totalRelations: details.reduce((acc, curr) => acc + curr.overview.totalRelations, 0),
        totalTestCases: details.reduce((acc, curr) => acc + curr.overview.totalTestCases, 0),
        failedTests: details.filter(t => t.overview.failedRelations).length,
        failedRelations: details.reduce((acc, curr) => acc + curr.overview.failedRelations, 0),
        failedTestCases: details.reduce((acc, curr) => acc + curr.overview.failedTestCases, 0),
        passedTests: details.filter(t => !t.overview.failedRelations).length,
        passedRelations: details.reduce((acc, curr) => acc + curr.overview.passedRelations, 0),
        passedTestCases: details.reduce((acc, curr) => acc + curr.overview.passedTestCases, 0),
    }
    return { details, overview }
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
                result.target = metamorphicTest.aut;
                result.summary = getTestSummary(result);
                return result;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static async displayTestReport(report) {
        try {
            const executionReport = await report
            displayReport(executionReport);
            displaySummary(getExecutionSummary([executionReport]));
        } catch (err) {
            console.log(err);
        }
    }

    static executeAll(metamorphicTests) {
        const reports = metamorphicTests.map(test => {
            return Promise.all(test.execute())
                .then(result => {
                    result.target = test.aut;
                    result.summary = getTestSummary(result);
                    return result;
                })
                .catch(err => {
                    console.log(err);
                })
        });
        return reports;
    }

    static async displayAllTestReport(reports) {
        try {
            const executionReports = await Promise.all(reports);
            executionReports.forEach(report => displayReport(report))
            displaySummary(getExecutionSummary(executionReports));
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = TestExecutor;