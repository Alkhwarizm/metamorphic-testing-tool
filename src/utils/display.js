const chalk = require('chalk');
const createUI = require('cliui');
const log = console.log;

function showTitle() {
    log(chalk``);
}

function createResultSummaryTable(contents) {
    const ui = createUI();
    const headerColor = 'bold.inverse.yellow';
    const rowColor = (failed) => failed ? 'red' : 'green';
    const defaultColSetting = { width: 12 }
    const firstColSetting = { width: 6, padding: [0, 1, 0, 0], align: 'right'  }
    const thirdColSetting = { width: 12, padding: [0, 1, 0, 0], align: 'right'  }
    ui.div({ text: chalk`{bold.yellow METAMORPHIC TEST RESULT}`, padding: [1, 1, 1, 1], align: 'center'})
    ui.div(
        { text: chalk`{${headerColor} Test}`, ...firstColSetting }, 
        { text: chalk`{${headerColor} Relations}`, },
        { text: chalk`{${headerColor} Test Cases}`, ...thirdColSetting },
        { text: chalk`{${headerColor} Failed}`, ...defaultColSetting },
        { text: chalk`{${headerColor} Percentage}`, ...defaultColSetting }, 
    );
    contents.forEach((row, idx) => {
        const percentage = Number.parseFloat(row.passed/row.testCases*100).toFixed(2);
        const color = rowColor(row.failed);
        ui.div(
            { text: chalk`{${color} ${idx+1}}`, ...firstColSetting }, 
            { text: chalk`{${color} ${row.relation.description}}`, },
            { text: chalk`{${color} ${row.testCases}}`, ...thirdColSetting },
            { text: chalk`{${color} ${row.failed}}`, ...defaultColSetting },
            { text: chalk`{${color} ${percentage}%}`, ...defaultColSetting }, 
        );
    });
    return ui.toString();
}

function showSummary(summary) {
    const {
        totalRelations,
        totalTestCases,
        failedRelations,
        failedTestCases,
        passedRelations,
        passedTestCases,
        details
    } = summary;

    log(createResultSummaryTable(details));
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