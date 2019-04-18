const {
  displayExecution,
  displayReport,
  displaySummary,
} = require('../plugins/display.js');
const { TestResults, TestReport } = require('./TestReport.js');

function getExecutionSummary(results) {
  const details = results.map((result, idx) => ({
    test: {
      idx: idx + 1,
      target: result.target,
    },
    relations: result.summary.details,
    overview: result.summary.overview,
  }));
  const overview = {
    totalTests: details.length,
    totalRelations: details.reduce((acc, curr) => acc + curr.overview.totalRelations, 0),
    totalTestCases: details.reduce((acc, curr) => acc + curr.overview.totalTestCases, 0),
    failedTests: details.filter(t => t.overview.failedRelations).length,
    failedRelations: details.reduce((acc, curr) => acc + curr.overview.failedRelations, 0),
    failedTestCases: details.reduce((acc, curr) => acc + curr.overview.failedTestCases, 0),
    passedTests: details.filter(t => !t.overview.failedRelations).length,
    passedRelations: details.reduce((acc, curr) => acc + curr.overview.passedRelations, 0),
    passedTestCases: details.reduce((acc, curr) => acc + curr.overview.passedTestCases, 0),
  };
  return { details, overview };
}

function getTestSummary(result) {
  const details = result.map((item, idx) => ({
    relation: {
      description: item.relation.description,
      idx,
    },
    testCases: item.meta.total,
    failed: item.meta.failed,
    passed: item.meta.passed,
  }));
  const overview = {
    totalRelations: result.length,
    totalTestCases: result.reduce((acc, curr) => acc + curr.meta.total, 0),
    failedRelations: result.filter(r => !r.meta.result).length,
    failedTestCases: result.reduce((acc, curr) => acc + curr.meta.failed, 0),
    passedRelations: result.filter(r => r.meta.result).length,
    passedTestCases: result.reduce((acc, curr) => acc + curr.meta.passed, 0),
  };
  return {
    overview,
    details,
  };
}

class TestExecutor {
  static execute(metamorphicTest) {
    displayExecution(metamorphicTest.aut, metamorphicTest.mrs);
    const testReport = new TestReport();
    const result = Promise.all(metamorphicTest.execute())
      .then((result) => {
        return new TestResults(result, metamorphicTest.aut);
      })
      .catch((err) => {
        console.log(err);
      });
    testReport.submitResults([result]);
    return testReport;
  }

  static executeAll(metamorphicTests) {
    const testReport = new TestReport();
    const results = metamorphicTests.map(test => Promise.all(test.execute())
      .then((result) => {
        return new TestResults(result, test.aut);
      })
      .catch((err) => {
        console.log(err);
      }));
    testReport.submitResults(results)
    return testReport;
  }

  static async displayAllTestReport(report) {
    try {
      report.results.forEach(async result => displayReport((await result).records));
      displaySummary(await report.summary);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = TestExecutor;
