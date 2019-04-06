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
    results.forEach(result => showMetamorphicRelation(result));
}

function showMetamorphicRelation(result) {
    const color = result.meta.result ? 'green' : 'red'
    log(chalk`{bold.${color}.inverse ${result.relation.description}}`);
    log(chalk`{${color} Passed Test Case(s): ${result.meta.passed}/${result.meta.total}}`);
    result.testCases.forEach(testcase => showTestCase(testcase));
}

function showTestCase(testcase) {
    if (testcase.error) {
        log(chalk`{red.inverse Error:} {redBright ${testcase.error}}`);
    } else {
        const color = testcase.result ? 'green' : 'red';
        const textResult = testcase.result ? 'Passed' : 'Failed';

        log(chalk`{${color} -- ${textResult}}`);
        testcase.inputs.forEach((input, idx) => {
            const textInput = JSON.stringify(input);
            const textOutput = testcase.outputs[idx];
            if (idx === 0) {
                log(chalk`{${color} ---- source: ${textInput} -> ${textOutput}}`);
            } else {
                log(chalk`{${color} ---- foll_${idx}: ${textInput} -> ${textOutput}}`);
            }
        })
    }
}

function display(results) {
    showTitle();
    showAllResults(results);    
    showSummary(results.summary);
}

module.exports = display