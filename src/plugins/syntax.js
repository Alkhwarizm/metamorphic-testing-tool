const MetamorphicTesting = require('../core/MetamorphicTesting.js');
const APIUnderTest = require('../core/APIUnderTest.js');
const MetamorphicRelation = require('../core/MetamorphicRelation.js');
const TestExecutor = require('../core/TestExecutor.js');
const helpers = require('../plugins/helper/helpers.js');

function defaultWrapper() { return {}; }
function defaultExtractor() { return Promise.resolve(''); }

class TestInterface {
  constructor(
    uri = '',
    method = 'GET',
    parameters = {},
    protocolFunction = { wrapper: defaultWrapper, extractor: defaultExtractor },
  ) {
    const api = new APIUnderTest({ uri, method }, parameters, protocolFunction);
    this.test = new MetamorphicTesting(api);
  }

  defineAPI(uri, method, parameters) {
    this.test.aut.uri = uri;
    this.test.aut.httpMethod = method;
    this.test.aut.parameters = parameters;
  }

  setWrapper(wrapperFn) {
    this.test.aut.functions.wrapper = wrapperFn;
  }

  setExtractor(extractorFn) {
    this.test.aut.functions.extractor = extractorFn;
  }

  addRelation(description, transformationFn, relationFn, testCaseCount = 1) {
    const mr = new MetamorphicRelation(
      transformationFn,
      relationFn,
      description,
      testCaseCount,
    );
    this.test.addRelation(mr);
  }

  execute() {
    this.result = TestExecutor.execute(this.test);
    return this.result;
  }
}

TestInterface.helper = helpers;
module.exports = TestInterface;
