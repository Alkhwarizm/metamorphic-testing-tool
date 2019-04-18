class TestRecord {
  constructor(result, relation) {
    this.meta = {
      total: result.length,
      passed: result.filter(tc => tc.result).length,
      failed: result.filter(tc => !tc.result).length,
    };
    this.meta.result = this.meta.total === this.meta.passed;
    this.relation = relation;
    this.testCases = result;
  }
}

class TestResults {
  constructor(records, targetAPI) {
    this.records = records;
    this.target = targetAPI;
    this.summary = this.calculateSummary();
  }

  calculateSummary() {
    const result = this.records;
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
}

class TestReport {
  constructor() {
    this.createDate = Date.now();
    this.results = [];
    this.summary = {};
    this.submitDate = undefined;
  }

  async getExecutionTime() {
    const millis = await this.finishDate - this.createDate;
    return millis;
  }

  submitResults(results) {
    this.finishDate = Promise.all(results).then(() => Date.now());
    this.results = results;
    this.summary = this.calculateSummary();
  }

  async calculateSummary() {
    const results = await Promise.all(this.results);
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
}

module.exports = {
  TestRecord,
  TestResults,
  TestReport,
};
