const chalk = require('chalk');
const log = console.log;

function display(result) {
    result.forEach(el => {
        log(chalk.bold.green.inverse(el.relation.description));
        el.testCases.forEach(testcase => {
            const text = `---- Inputs: [${testcase.inputs.map(i => JSON.stringify(i)).join(', ')}] \n---- Outputs: [${testcase.outputs.join(', ')}]`
            if (testcase.result) {
                log(chalk.green.bold('-- Passed'))
                log(chalk.green(text));
            } else {
                log(chalk.red.bold('-- Failed'))
                log(chalk.red(text));
            }
        })
    });
}

class TestExecutor {
    static execute(metamorphicTest) {
        const result = Promise.all(metamorphicTest.execute())
            .then(result => {
                display(result) // display(result)
            });
    }
}

module.exports = TestExecutor;