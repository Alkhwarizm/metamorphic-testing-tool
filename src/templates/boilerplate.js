const MetamorphicTest = require('mt-tools-prototype');

const { helper } = MetamorphicTest;
const test = new MetamorphicTest();

test.defineAPI(
  '', // API URI
  '', // HTTP method
  {}, // parameters
);

// set wrapper function to wrap input into request
test.setWrapper(input => {
    return {}; // return request-promise options object
});

// set extractor function to extract output from resp
test.setExtractor(resp => {
    return resp.then(); // return a thenable promise
});

// add metamorphic relation
test.addRelation('', // human readable metamorphic description
  (parameters) => {
    const source = {}; // source input or i0
    const following = {}; // following input or i1 and onward
    return [source, following]; // return list of input
  }, (outputs) => {
      return true; // return outputs comparison result
  }, 
  2); // number of generated testcases

module.exports = test;
