const chalk = require('chalk');
const createUI = require('cliui');

const { log } = console;

function showTitle(targetAPI) {
  const uriColor = 'white';
  log(chalk`{yellow.inverse.bold Operation:} {${uriColor} ${targetAPI.httpMethod} ${targetAPI.uri}}`);
}

function createTestSummaryRows(testResult, columnSetting) {
  const summaryRows = [];
  testResult.relations.forEach((row) => {
    const percentage = Number.parseFloat(row.passed / row.testCases * 100).toFixed(2);
    const color = row.failed ? 'red' : 'green';
    summaryRows.push([
      { text: chalk`{${color} ${testResult.test.idx}}`, ...columnSetting[0] },
      { text: chalk`{${color} ${row.relation.description}}`, ...columnSetting[1] },
      { text: chalk`{${color} ${row.testCases}}`, ...columnSetting[2] },
      { text: chalk`{${color} ${row.failed}}`, ...columnSetting[3] },
      { text: chalk`{${color} ${percentage}%}`, ...columnSetting[4] },
    ]);
  });
  return summaryRows;
}

function createExecutionSummaryTable(executionSummary) {
  const { details, overview } = executionSummary;
  const ui = createUI();
  const headerColor = 'bold.inverse.yellow';
  const footerColor = 'bold.yellow';
  const sumColor = overview.failedTestCases ? 'bold.red' : 'bold.green';
  const columnSetting = [
    { width: 6, padding: [0, 1, 0, 0], align: 'right' },
    {},
    { width: 12, padding: [0, 1, 0, 0], align: 'right' },
    { width: 12 },
    { width: 12 },
  ];

  ui.div({ text: chalk`{bold.yellow METAMORPHIC TEST RESULT}`, padding: [1, 1, 1, 1], align: 'center' });
  ui.div(
    { text: chalk`{${headerColor} Test}`, ...columnSetting[0] },
    { text: chalk`{${headerColor} Relations}`, ...columnSetting[1] },
    { text: chalk`{${headerColor} Test Cases}`, ...columnSetting[2] },
    { text: chalk`{${headerColor} Failed}`, ...columnSetting[3] },
    { text: chalk`{${headerColor} Percentage}`, ...columnSetting[4] },
  );

  details.forEach((testResult) => {
    createTestSummaryRows(testResult, columnSetting).forEach((rows) => {
      ui.div(...rows);
    });
  });

  const border = '‒';
  ui.div(
    { text: chalk`{${footerColor} ${border.repeat(columnSetting[0].width - 1)}}`, ...columnSetting[0] },
    { text: chalk`{${footerColor} }`, ...columnSetting[1] },
    { text: chalk`{${footerColor} ${border.repeat(columnSetting[2].width - 1)}}`, ...columnSetting[2] },
    { text: chalk`{${footerColor} ${border.repeat(columnSetting[3].width - 1)}}`, ...columnSetting[3] },
    { text: chalk`{${footerColor} ${border.repeat(columnSetting[4].width - 1)}}`, ...columnSetting[4] },
  );
  const ratio = overview.passedTestCases / overview.totalTestCases;
  const percentage = Number.parseFloat(ratio * 100).toFixed(2);
  ui.div(
    { text: chalk`{${sumColor} ${overview.totalTests}}`, ...columnSetting[0] },
    { text: chalk`{${sumColor} }`, ...columnSetting[1] },
    { text: chalk`{${sumColor} ${overview.totalTestCases}}`, ...columnSetting[2] },
    { text: chalk`{${sumColor} ${overview.failedTestCases}}`, ...columnSetting[3] },
    { text: chalk`{${sumColor} ${percentage}%}`, ...columnSetting[4] },
  );
  return ui.toString();
}

function showTestCase(testcase, testIdx) {
  const ui = createUI();
  const columnSetting = [
    { width: 8, padding: [0, 1, 0, 0] },
    {}, {}, { width: 6 },
  ];
  if (testcase.error) {
    ui.div(
      { text: chalk`{red ${testIdx}}`, ...columnSetting[0] },
      { text: chalk`{red.inverse Error:} {redBright ${testcase.error}}`, ...columnSetting[1] },
    );
  } else {
    const color = testcase.result ? 'green' : 'red';
    const textResult = testcase.result ? 'Passed' : 'Failed';

    ui.div(
      { text: chalk`{${color}.underline TC ${testIdx}}`, ...columnSetting[0] },
      { text: chalk`{${color}.underline Input}`, ...columnSetting[1] },
      { text: chalk`{${color}.underline Output}`, ...columnSetting[2] },
      { text: chalk`{${color}.bold ${textResult}}`, ...columnSetting[3] },
    );
    testcase.inputs.forEach((input, idx) => {
      const textInput = JSON.stringify(input);
      const textOutput = JSON.stringify(testcase.outputs[idx]);
      ui.div(
        { text: chalk`{${color} ${idx === 0 ? 'source' : `foll_${idx}`}}`, ...columnSetting[0] },
        { text: chalk`{${color} ${textInput}}`, ...columnSetting[1] },
        { text: chalk`{${color} ${textOutput}}`, ...columnSetting[2] },
        { text: chalk`{${color} }`, ...columnSetting[3] },
      );
    });
  }
  log(ui.toString());
}

function showMetamorphicRelation(result) {
  const color = result.meta.result ? 'green' : 'red';
  log(chalk`{bold.${color}.inverse ${result.relation.description}}`,
    chalk`{${color} Passed Test Case(s): ${result.meta.passed}/${result.meta.total}}`);
  result.testCases.forEach((testcase, idx) => showTestCase(testcase, idx + 1));
  log();
}

function showAllResults(results) {
  results.forEach(result => showMetamorphicRelation(result));
}

function displayResult(result) {
  showTitle(result.target);
  showAllResults(result.records);
}

function displayExecution(tests) {
  const ui = createUI();
  const mainColor = 'yellow';
  const uriColor = 'white';
  ui.div({ text: chalk`{${mainColor}.bold.inverse METAMORPHIC TEST EXECUTION}`})

  let totalTC = 0;
  let totalRel = 0;
  tests.forEach((test, idx) => {
    const relCount = test.mrs.length;
    const tcCount = test.mrs.reduce((acc, curr) => acc + curr.testCaseCount, 0);
    ui.div(
      { text: chalk`{${mainColor} ${idx+1}}`, width: 4, align: 'right', padding: [0, 1, 0, 0] },
      { text: chalk`{${uriColor} ${test.aut.httpMethod} ${test.aut.uri}}` },
      { text: chalk`{${mainColor} ${relCount} relations}`, width: 16, align: 'right' },
      { text: chalk`{${mainColor} ${tcCount} test cases}`, width: 16, align: 'right' }
    )
    totalRel += relCount;
    totalTC += tcCount;
  })

  ui.div({ 
    text: chalk`{${mainColor} Executing ${totalTC} test cases from ${totalRel} relations in ${tests.length} tests...}`,
    padding: [1, 0, 0, 0]
  });
  log();
  log(ui.toString());
}

function displaySummary(executionSummary) {
  log(createExecutionSummaryTable(executionSummary));
}

module.exports = {
  displayExecution,
  displaySummary,
  displayResult,
};
