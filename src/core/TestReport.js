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

class TestResults {
    constructor(records, targetAPI) {
        this.records = records;
        this.target = targetAPI;
        this.summary = getTestSummary(records);
    }
}

module.exports = {
    TestRecord,
    TestResults
}