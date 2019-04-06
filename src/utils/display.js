const chalk = require('chalk');
const log = console.log;

function showTitle() {
    log(chalk``);
}

function showSummary(summary) {
    const {
        totalRelations,
        totalTestCases,
        failedRelations,
        failedTestCases,
        passedRelations,
        passedTestCases
    } = summary;
    log(chalk`
        {yellow.bold.inverse SUMMARY}
        {yellow Relations: {${failedRelations ? 'red' : 'green'} ${passedRelations}/${totalRelations}}}
        {yellow Test Cases: {${failedTestCases ? 'red' : 'green'} ${passedTestCases}/${totalTestCases}}}
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

        log(chalk`{bold.${color} -- ${textResult}}`);
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

function displayReport(results) {
    showTitle();
    showAllResults(results);    
    showSummary(results.summary);
}

function displayExecution(address, mrs) {
    const relationCount = mrs.length;
    const testCaseCount = mrs.reduce((acc, curr) => acc + curr.testCaseCount, 0);
    log(chalk`
        {yellow.bold.inverse TEST EXECUTION}
        {yellow Operation: }{white ${address.httpMethod} ${address.uri}}
        {yellow Executing ${testCaseCount} test cases from ${relationCount} relations...}
    `);
}

module.exports = {
    displayReport,
    displayExecution
}