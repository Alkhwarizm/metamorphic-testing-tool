const send = require('request-promise');
const { TestRecord } = require('./TestReport.js');

class MetamorphicTesting {
  constructor(aut, mrs = []) {
    this.aut = aut;
    this.mrs = mrs;
  }

  get uri() {
    return this.aut.uri;
  }

  get method() {
    return this.aut.httpMethod;
  }

  get parameters() {
    return this.aut.parameters;
  }

  get relations() {
    return this.mrs;
  }

  addRelation(...mrs) {
    mrs.forEach((mr) => {
      this.mrs.push(mr);
    });
  }

  execute() {
    const reports = [];
    this.mrs.forEach((relation) => {
      const params = this.parameters;

      const results = [];
      for (let i = 0; i < relation.testCaseCount; i += 1) {
        // create test cases
        const inputs = relation.transform(params);

        // wrap inputs into requests
        const reqs = inputs.map(input => this.aut.wrap(input));
        // send request and receive response
        const resps = reqs.map((req) => {
          req.method = this.method;
          return send(this.uri, req);
        });

        // extract outputs from request
        const outputs = Promise.all(resps.map(resp => this.aut.extract(resp)))
          .then((output) => {
            const report = { inputs, outputs: output };
            report.result = relation.assert(output);
            return report;
          })
          .catch(err => ({ 
            error: err || 'unknown error',
            inputs,
          }));

        results.push(outputs);
      }

      const report = new Promise((resolve) => {
        Promise.all(results)
          .then((testResult) => {
            resolve(new TestRecord(testResult, relation));
          });
      });
      reports.push(report);
    });

    return reports;
  }
}

module.exports = MetamorphicTesting;
