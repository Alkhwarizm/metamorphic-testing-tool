const path = require('path');
const logDir = process.env.LOG_DIR || '.'
const logFile = path.join(logDir, `MTT-${new Date().toISOString().replace(/[ ]/g, '-')}.log`);

const logger = require('simple-node-logger').createSimpleFileLogger(logFile);

logger.logExecution = function(tests) {
    this.info('Operations: ');

    let totalTC = 0;
    let totalRel = 0;
    tests.forEach((test, idx) => {
        const relCount = test.mrs.length;
        const tcCount = test.mrs.reduce((acc, curr) => acc + curr.testCaseCount, 0);

        this.info(`${idx+1} ${test.aut.httpMethod} ${test.aut.uri}: ${relCount} relations, ${tcCount} test cases`);

        totalRel += relCount;
        totalTC += tcCount;
    });

    this.info(`Executing ${totalTC} test cases from ${totalRel} relations in ${tests.length} tests.`);
}

function logResult(result) {
    this.info(`Operation: ${result.target.httpMethod} ${result.target.uri}`);

    result.records.forEach(record => {
        this.info(`${record.relation.description}, passed ${record.meta.passed}/${record.meta.total} test cases.`);
        record.testCases.forEach((testcase, idx) => {
            if (testcase.error) {
                this.error(`  TC ${idx+1} ${testcase.error}`);
            } else {
                const textResult = testcase.result ? 'Passed' : 'Failed';
                this.info(`  TC ${idx+1} ${textResult}`);
                testcase.inputs.forEach((input, i) => {
                    this.info(`    ${i === 0 ? 'source' : `foll_${idx}`}`)
                    this.info(`    -- Input : ${JSON.stringify(input)}`);
                    this.info(`    -- Output: ${testcase.outputs[i]}`);
                });
            }
        });
    })
}

function logSummary(summary) {
    const { details, overview } = summary;
    const ratio = overview.passedTestCases / overview.totalTestCases;
    const overallPercentage = Number.parseFloat(ratio * 100).toFixed(2);
    
    this.info('TEST RESULT SUMMARY');
    details.forEach(testResult => {
        this.info(`  Test #${testResult.test.idx}`)
        testResult.relations.forEach((item) => {
            const percentage = Number.parseFloat(item.passed / item.testCases * 100).toFixed(2);
            this.info(`    ${item.relation.description}`);
            this.info(`    -- ${item.failed}/${item.testCases} test cases failed.`);
            this.info(`    -- ${percentage}% passed.`);
        })
    });

    this.info(`>> ${overview.totalTests} tests.`);
    this.info(`>> ${overview.totalTestCases} test cases failed.`);
    this.info(`>> ${overallPercentage}% passed.`)
}

logger.logTestReport = async function(report) {
    try {
        report.results.forEach(async result => logResult.bind(this)(await result));
        logSummary.bind(this)(await report.summary);
    } catch (error) {
        this.error(error);
    }
}

module.exports = logger