const send = require('request-promise');

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

      const results = []
      for (let i = 0; i < relation.testCaseCount; i++) {
        // create test cases
        const inputs = relation.transform(params);
        
         // wrap inputs into requests
        const reqs = inputs.map((input) => this.aut.wrap(input));
        // send request and receive response
        const resps = reqs.map((req) => {
          req.method = this.method;
          return send(this.uri, req);
        }); 

        // extract outputs from request
        const outputs = Promise.all(resps.map((resp) => this.aut.extract(resp)))
          .then(outputs => {
            const report = {inputs, outputs}
            report.result = relation.assert(outputs);
            return report;
          })
          .catch(err => {
            return { error: err.statusCode };
          });
        
        results.push(outputs);
      }
      
      const report = new Promise((resolve, reject) => {
        Promise.all(results)
          .then(testResult => {
            resolve({ relation, testCases: testResult })
          });
      })
      reports.push(report);
    })

    return reports;
  }
}

module.exports = MetamorphicTesting;