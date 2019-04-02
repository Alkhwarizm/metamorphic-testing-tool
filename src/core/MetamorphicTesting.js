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
      const inputs = relation.transform(params);
      
      const reqs = inputs.map((input) => this.aut.wrap(input));
      const resps = reqs.map((req) => {
        req.method = this.method;
        return send(this.uri, req);
      });
      const outputs = Promise.all(resps.map((resp) => this.aut.extract(resp)))
        .then(outputs => {
          const report = {inputs, outputs}
          report.result = relation.assert(outputs);
          return report;
        });
      
      const report = new Promise((resolve, reject) => {
        outputs.then(results => {
          resolve({
            relation,
            results
          })
        })
      })
      reports.push(report);
    })

    return reports;
  }
}

module.exports = MetamorphicTesting;