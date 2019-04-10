const chalk = require('chalk');
const createUI = require('cliui');
const log = console.log;

function showTitle() {
    log(chalk``);
}

function createTestSummaryRows(testResult, columnSetting) {
    const summaryRows = []
    testResult.relations.forEach((row, idx) => {
        const percentage = Number.parseFloat(row.passed/row.testCases*100).toFixed(2);
        const color = row.failed ? 'red' : 'green';
        summaryRows.push([
            { text: chalk`{${color} ${testResult.test.idx}}`, ...columnSetting[0] }, 
            { text: chalk`{${color} ${row.relation.description}}`, ...columnSetting[1] },
            { text: chalk`{${color} ${row.testCases}}`, ...columnSetting[2] },
            { text: chalk`{${color} ${row.failed}}`, ...columnSetting[3] },
            { text: chalk`{${color} ${percentage}%}`, ...columnSetting[4] }, 
        ])
    })
    return summaryRows;
}

function createExecutionSummaryTable(executionSummary) {
    const { details, overview } = executionSummary;
    const ui = createUI();
    const headerColor = 'bold.inverse.yellow';
    const footerColor = 'bold.yellow';
    const sumColor = overview.failedTestCases ? 'bold.red' : 'bold.green';
    const columnSetting = [
        { width: 6, padding: [0, 1, 0, 0], align: 'right'  },
        {},
        { width: 12, padding: [0, 1, 0, 0], align: 'right'  },
        { width: 12 },
        { width: 12 },
    ]
    
    ui.div({ text: chalk`{bold.yellow METAMORPHIC TEST RESULT}`, padding: [1, 1, 1, 1], align: 'center'})
    ui.div(
        { text: chalk`{${headerColor} Test}`, ...columnSetting[0] }, 
        { text: chalk`{${headerColor} Relations}`, ...columnSetting[1] },
        { text: chalk`{${headerColor} Test Cases}`, ...columnSetting[2] },
        { text: chalk`{${headerColor} Failed}`, ...columnSetting[3] },
        { text: chalk`{${headerColor} Percentage}`, ...columnSetting[4] }, 
    );
    
    details.forEach((testResult) => {
        createTestSummaryRows(testResult, columnSetting).forEach(rows => {
            ui.div(...rows);
        })
    })
    
    const border = '‒'
    ui.div(
        { text: chalk`{${footerColor} ${border.repeat(columnSetting[0].width-1)}}`, ...columnSetting[0] },
        { text: chalk`{${footerColor} }`, ...columnSetting[1] },
        { text: chalk`{${footerColor} ${border.repeat(columnSetting[2].width-1)}}`, ...columnSetting[2] },
        { text: chalk`{${footerColor} ${border.repeat(columnSetting[3].width-1)}}`, ...columnSetting[3] },
        { text: chalk`{${footerColor} ${border.repeat(columnSetting[4].width-1)}}`, ...columnSetting[4] },
    )
    const percentage = Number.parseFloat(overview.passedTestCases/overview.totalTestCases*100).toFixed(2);
    ui.div(
        { text: chalk`{${sumColor} ${overview.totalTests}}`, ...columnSetting[0] },
        { text: chalk`{${sumColor} }`, ...columnSetting[1] },
        { text: chalk`{${sumColor} ${overview.totalTestCases}}`, ...columnSetting[2] },
        { text: chalk`{${sumColor} ${overview.failedTestCases}}`, ...columnSetting[3] },
        { text: chalk`{${sumColor} ${percentage}%}`, ...columnSetting[4] },
    )
    return ui.toString();
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

function displaySummary(executionSummary) {
    log(createExecutionSummaryTable(executionSummary));
}

module.exports = {
    displayReport,
    displayExecution,
    displaySummary
}