const chalk = require('chalk');
const log = console.log;

function showTitle() {

}

function showSummary(summary) {
    const {
        totalRelations,
        totalTestCase,
        failedRelations,
        failedTestCase,
    } = summary;
    log(chalk`
        {yellow.bold.inverse SUMMARY}
        {yellow Relations: {${failedRelations ? 'red' : 'green'} ${totalRelations - failedRelations}/${totalRelations}}}
        {yellow Test Cases: {${failedTestCase ? 'red' : 'green'} ${totalTestCase - failedTestCase}/${totalTestCase}}}
    `)
}

function showAllResults(results) {
    results.forEach(relation => showMetamorphicRelation(relation));
}

function showMetamorphicRelation(relation) {
    log(chalk.bold.green.inverse(relation.relation.description));
    relation.testCases.forEach(testcase => showTestCase(testcase));
}

function showTestCase(testcase) {
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
}

function display(results) {
    showTitle();
    showAllResults(results);    
    showSummary(results.summary);
}

module.exports = display