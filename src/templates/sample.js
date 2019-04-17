const MetamorphicTest = require('../index.js');

const { helper } = MetamorphicTest;
const test = new MetamorphicTest();

test.defineAPI(
  'https://www.google.com/search', // API URI
  'GET', // HTTP method
  { q: 'string' }, // parameters
);

// set wrapper function to wrap input into request
// return request-promise options object
test.setWrapper(input => ({
  qs: {
    q: input.q,
    hl: 'en', // to set the page to english
  },
}));

// set extractor function to extract output from resp
// return a thenable promise
test.setExtractor(resp => resp.then((htmlString) => {
  const regex = /About ([0-9,]*) results/;
  return Number.parseInt(htmlString.match(regex)[1].replace(/,/g, ''), 10);
}));

// add metamorphic relation
test.addRelation('Less result for more specific search query', // human readable metamorphic description
  (parameters) => { // eslint-disable-line no-unused-vars
    // transformation function that define inputs
    const words = ['metamorphic', 'testing', 'restful', 'api'];
    const source = {
      q: helper.chooseRandomElement(words),
    }; // source input or i0
    const following = {
      q: `${source.q} ${helper.chooseRandomElement(words)}`,
    }; // following input or i1 and onward
    return [source, following];
  }, outputs => outputs[0] > outputs[1], // relation function that define how outputs are compared
  2);

module.exports = test;
