const MetamorphicTest = require('../index.js');
const helper = MetamorphicTest.helper
const test = new MetamorphicTest();

test.defineAPI('http://localhost:3333/cos', 'GET', {x: 'number'});

test.setWrapper((input) => {
    return {
        qs: input
    }
})

test.setExtractor((resp) => {
    return resp.then((htmlString) => {
        return Number.parseFloat(htmlString);
    });
})

test.addRelation('Same value every 2Pi.',
    (parameters) => {
        const source = { x: helper.getRandomFloat(-100, 100) }; // source input or i0
        const following = { x: source.x + 2*Math.PI }; // following input or i1 and onward
        return [source, following]
    }, (outputs) => {
        return outputs[0] === outputs[1];
    }, 3);

test.addRelation('Negative value every Pi.',
    (parameters) => {
        const source = { x: helper.getRandomFloat(-100, 100) };
        const following = { x: source.x + Math.PI };
        return [source, following];
    }, (outputs) => {
        return outputs[0] === -outputs[1];
    }, 3);

test.addRelation('Descending value in (4n+1)Pi/2 to (4n+3)Pi/2 interval.',
    (parameters) => {
        const n = helper.getRandomInt(-100, 100);
        const b = helper.getRandomFloat((4*n + 1)*Math.PI/2, (4*n + 3)*Math.PI/2);
        const a = helper.getRandomFloat((4*n + 1)*Math.PI/2, b);

        const source = { x: a };
        const following = { x: b };
        return [source, following];
    }, (outputs) => {
        return outputs[0] > outputs[1];
    }, 3);

test.addRelation('Ascending value in (4n-1)Pi/2 to (4n+1)Pi/2 interval.',
    (parameters) => {
        const n = helper.getRandomInt(-100, 100);
        const b = helper.getRandomFloat((4*n - 1)*Math.PI/2, (4*n + 1)*Math.PI/2);
        const a = helper.getRandomFloat((4*n - 1)*Math.PI/2, b);

        const source = { x: a };
        const following = { x: b };
        return [source, following];
    }, (outputs) => {
        return outputs[0] < outputs[1];
    }, 3);

test.execute();