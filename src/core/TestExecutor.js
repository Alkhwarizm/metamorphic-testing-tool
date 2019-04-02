function display(result) {
    result.forEach(el => {
        console.log(el);
    });
}

class TestExecutor {
    static execute(metamorphicTest) {
        const result = Promise.all(metamorphicTest.execute())
            .then(result => {
                display(result) // display(result)
            });
    }
}

module.exports = TestExecutor;