const chalk = require('chalk');
const log = console.log;

function display(result) {
    const {
        totalRelations,
        totalTestCase,
        failedRelations,
        failedTestCase,
    } = result.summary;
    log(chalk`
        {yellow.bold.inverse SUMMARY}
        {yellow Relations: {${failedRelations ? 'red' : 'green'} ${totalRelations - failedRelations}/${totalRelations}}}
        {yellow Test Cases: {${failedTestCase ? 'red' : 'green'} ${totalTestCase - failedTestCase}/${totalTestCase}}}
    `)

    result.forEach(el => {
        log(chalk.bold.green.inverse(el.relation.description));
        el.testCases.forEach(testcase => {
            if (testcase.error) {
                log(chalk`{red.inverse Error:} {redBright ${testcase.error}}`);
            } else {
                const text = `---- Inputs: [${testcase.inputs.map(i => JSON.stringify(i)).join(', ')}] \n---- Outputs: [${testcase.outputs.join(', ')}]`
               
                if (testcase.result) {
                    log(chalk.green.bold('-- Passed'))
                    log(chalk.green(text));
                } else {
                    log(chalk.red.bold('-- Failed'))
                    log(chalk.red(text));
                }
            }

        })
    });
}

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