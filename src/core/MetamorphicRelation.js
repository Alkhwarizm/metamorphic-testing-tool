class MetamorphicRelation {
  constructor(transformation, relation, description = '', testCaseCount = 1) {
    this.transformation = transformation;
    this.relation = relation;
    this.description = description;
    this.testCaseCount = testCaseCount;
  }

  transform(parameters) {
    return this.transformation(parameters);
  }

  assert(outputs) {
    return this.relation(outputs);
  }
}

module.exports = MetamorphicRelation;
