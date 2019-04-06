const { 
    MetamorphicTesting, 
    MetamorphicRelation, 
    APIUnderTest,
    TestExecutor,
    helper
} = require('./index.js');

const address = {
    uri: 'http://localhost:3333/cos',
    method: 'GET',
};

const parameters = {
    x: 'number',
}

const wrapper = (input) => {
    // input is like parameters with specific values for each properties
    return {
        qs: input
    }
    // it return request-promise options object
}

const extractor = (resp) => {
    // resp is promise returned by request-promise
    return resp.then((htmlString) => {
        return Number.parseFloat(htmlString);
    });
    // it return object or list that will be compared by metamorphic relation
}

const api = new APIUnderTest(address, parameters, {wrapper, extractor});

const trFn1 = (parameters) => {
    const source = { x: helper.getRandomFloat(-100, 100) }; // source input or i0
    const following = { x: source.x + 2*Math.PI }; // following input or i1 and onward
    return [source, following] // return list of inputs
}
const rlFn1 = (outputs) => {
    // compares outputs and return boolean value
    return outputs[0] === outputs[1];
}
const mr1 = new MetamorphicRelation(trFn1, rlFn1, 'Same value every 2Pi.', 3);

const trFn2 = (parameters) => {
    const source = { x: helper.getRandomFloat(-100, 100) };
    const following = { x: source.x + Math.PI };
    return [source, following];
}
const rlFn2 = (outputs) => {
    return outputs[0] === -outputs[1];
}
const mr2 = new MetamorphicRelation(trFn2, rlFn2, 'Negative value every Pi.', 3);

const trFn3 = (parameters) => {
    const n = helper.getRandomInt(-100, 100);
    const b = helper.getRandomFloat((4*n + 1)*Math.PI/2, (4*n + 3)*Math.PI/2);
    const a = helper.getRandomFloat((4*n + 1)*Math.PI/2, b);

    const source = { x: a };
    const following = { x: b };
    return [source, following];
}
const rlFn3 = (outputs) => {
    return outputs[0] > outputs[1];
}
const mr3 = new MetamorphicRelation(trFn3, rlFn3, 'Descending value in (4n+1)Pi/2 to (4n+3)Pi/2 interval.', 3);

const trFn4 = (parameters) => {
    const n = helper.getRandomInt(-100, 100);
    const b = helper.getRandomFloat((4*n - 1)*Math.PI/2, (4*n + 1)*Math.PI/2);
    const a = helper.getRandomFloat((4*n - 1)*Math.PI/2, b);

    const source = { x: a };
    const following = { x: b };
    return [source, following];
}
const rlFn4 = (outputs) => {
    return outputs[0] < outputs[1];
}
const mr4 = new MetamorphicRelation(trFn4, rlFn4, 'Ascending value in (4n-1)Pi/2 to (4n+1)Pi/2 interval.', 3);


const test = new MetamorphicTesting(api);
test.addRelation(mr1, mr2, mr3, mr4);

TestExecutor.execute(test);