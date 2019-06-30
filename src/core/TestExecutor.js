const {
  displayExecution,
  displaySummary,
  displayResult,
} = require('../plugins/display.js');
const { TestResults, TestReport } = require('./TestReport.js');

class TestExecutor {
  static execute(metamorphicTest) {
    displayExecution([metamorphicTest]);
    const testReport = new TestReport();
    const testResult = Promise.all(metamorphicTest.execute())
      .then(result => new TestResults(result, metamorphicTest.aut))
      .catch((err) => {
        console.log(err);
      });
    testReport.submitResults([testResult]);
    return testReport;
  }

  static executeAll(metamorphicTests) {
    displayExecution(metamorphicTests);
    const testReport = new TestReport();
    const testResults = metamorphicTests.map(test => Promise.all(test.execute())
      .then(result => new TestResults(result, test.aut))
      .catch((err) => {
        console.log(err);
      }));
    testReport.submitResults(testResults);
    return testReport;
  }

  static async displayTestReport(report, verboseLevel = 0) {
    try {
      if (verboseLevel === 1) {
        report.results.forEach(async result => displayResult(await result));
      }
      displaySummary(await report.summary);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = TestExecutor;
