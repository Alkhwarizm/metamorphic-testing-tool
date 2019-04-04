const { 
    MetamorphicTesting, 
    MetamorphicRelation, 
    APIUnderTest,
    TestExecutor,
    helper
} = require('./index.js');

const address = {
    uri: 'https://kitsu.io/api/edge/categories',
    method: 'GET',
};

const parameters = {
    'page[limit]': 10,
    'page[offset]': 0,
    'sort': null,
    'filter[nsfw]': null,
}

const wrapper = (input) => {
    // input is like parameters with specific values for each properties
    return {
        qs: input,
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        },
        json: true
    }
    // it return request-promise options object
}

const extractor = (resp) => {
    // resp is promise returned by request-promise
    return resp.then((jsonResp) => {
        return jsonResp.data.map(item => item.id); // only take the id
    });
    // it return object or list that will be compared by metamorphic relation
}

const api = new APIUnderTest(address, parameters, {wrapper, extractor});


const tFn1 = (parameters) => {
    const source = {
        'page[limit]': 300,
    }
    const following = {
        'page[limit]': source["page[limit]"],
        'sort': helper.chooseRandomElement(['title', 'totalMediaCount'])
    }
    return [source, following]
}
const rFn1 = (outputs) => {
    const comparator = (a, b) => a - b;
    return outputs[0].sort(comparator).join('') === outputs[1].sort(comparator).join('');
}
const mr1 = new MetamorphicRelation(tFn1, rFn1, 'Should return same items even when sorted');

const tFn2 = (parameters) => {
    const source = {
        'page[limit]': 300,
        'filter[nsfw]': false,
    }
    const following = {
        'page[limit]': source["page[limit]"],
        'filter[nsfw]': true,
    }
    return [source, following]
}
const rFn2 = (outputs) => {
    if (outputs[0].length === 0) throw new Error('empty source output');
    if (outputs[1].length === 0) throw new Error('empty following output');
    return outputs[0].every(el => !outputs[1].includes(el));
}
const mr2 = new MetamorphicRelation(tFn2, rFn2, 'Should return exactly different items')

const test = new MetamorphicTesting(api, [mr2]);

TestExecutor.execute(test);