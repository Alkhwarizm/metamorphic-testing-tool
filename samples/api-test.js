const MetamorphicTest = require('../index.js');
const helper = MetamorphicTest.helper;
const test = new MetamorphicTest();

const TEST_URI = 'https://kitsu.io/api/edge/categories'
const ACCESS_TOKEN = 'Bearer d6147d8858b12f4a60c1ebc4e4aaff4aea6c465a88e0d5fe29d0142479ccb409';
const comparator = (a, b) => a - b;

const parameters = {
    'page[limit]': 10,
    'page[offset]': 0,
    'sort': null,
    'filter[nsfw]': null,
}

test.defineAPI(TEST_URI, 'GET', parameters);

test.setWrapper((input) => {
    // input is like parameters with specific values for each properties
    return {
        qs: input,
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': ACCESS_TOKEN,
        },
        json: true
    }
    // it return request-promise options object
});

test.setExtractor((resp) => {
    // resp is promise returned by request-promise
    return resp.then((jsonResp) => {
        return jsonResp.data.map(item => item.id); // only take the id
    });
    // it return object or list that will be compared by metamorphic relation
});

test.addRelation('Should return the same items even when sorted.',
    (parameters) => {
        const source = {
            'page[limit]': 300,
        }
        const following = {
            'page[limit]': source["page[limit]"],
            'sort': helper.chooseRandomElement(['title', 'totalMediaCount'])
        }
        return [source, following]
    }, (outputs) => {
        return helper.isEquivalent(outputs);
    });

test.addRelation('Should return exactly different items', 
    (parameters) => {
        const source = {
            'page[limit]': 300,
            'filter[nsfw]': false,
        }
        const following = {
            'page[limit]': source["page[limit]"],
            'filter[nsfw]': true,
        }
        return [source, following]
    }, (outputs) => {
        return helper.isDisjoint(outputs);
    });

test.addRelation('Union of the following outputs should equal the source output',
    (parameters) => {
        const source = {
            'page[limit]': 300,
        }
        const following1 = {
            'page[limit]': source["page[limit]"],
            'filter[nsfw]': false,
        }
        const following2 = {
            'page[limit]': source["page[limit]"],
            'filter[nsfw]': true,
        }
        return [source, following1, following2];
    }, (outputs) => {
        return helper.isComplete(outputs);
    });

test.addRelation('Page limited search should be the subset of all result.', 
    (parameters) => {
        const source = {
            'page[limit]': 300
        }
        const following = {
            'page[limit]': 10,
            'page[offset]': helper.getRandomInt(0, 200),
        }
        return [source, following]
    }, (outputs) => {
        return helper.isSubset(outputs);
    }, 2);

module.exports = test;