class APIUnderTest {
  constructor(address = {}, parameters = {}, functions = {}) {
    this.address = address;
    this.parameters = parameters;
    this.functions = functions;
  }

  get uri() {
    return this.address.uri;
  }

  set uri(uri) {
    this.address.uri = uri;
  }

  get httpMethod() {
    return this.address.method;
  }

  set httpMethod(method) {
    this.address.method = method;
  }

  wrap(input) {
    return this.functions.wrapper(input);
  }

  extract(resp) {
    const out = this.functions.extractor(resp);
    // console.log(typeof out);
    return out;
  }
}

module.exports = APIUnderTest;
