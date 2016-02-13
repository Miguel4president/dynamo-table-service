var assert = require('assert');
var Converter = new (require('../src/dynamoConverter'))();

// _________________________SETUP
var myDesign = {
  type: "S",
  name: "fieldName",
  value: "valueOfSaidField"
}

var myDesign2 = {
  type: "S2",
  name: "fieldName2",
  value: "valueOfSaidField2"
}

var awsDesign = {
  "fieldName" : { "S" : "valueOfSaidField" }
}

var awsDesign2 = {
  "fieldName" : { "S" : "valueOfSaidField" },
  "fieldName2" : { "S2" : "valueOfSaidField2" }
}

var invalidDesign = {
  tope: "S",
  narm: "name"
}

// ______________________________________________TESTS
describe('Converter', function() {

  describe('constructor', function() {
    
    it('should have two functions', function() {
      assert.equal('function', typeof Converter.asAwsItem);
      assert.equal('function', typeof Converter.asMyItem);
    });

  });

  describe('#asAwsItem()', function() {

    it("should convert a single my item into an aws item", function() {
      assert.deepEqual(awsDesign, Converter.asAwsItem([myDesign]));
    });

    it("should convert an array of my items into an aws item", function() {
      assert.deepEqual(awsDesign2, Converter.asAwsItem([myDesign, myDesign2]));
    });

    it("should return the original itemArray if it is not in my form", function() {
      assert.deepEqual([invalidDesign], Converter.asAwsItem([invalidDesign]));
    });

    it("should return the original itemArray if it is empty", function() {
      assert.deepEqual([], Converter.asAwsItem([]));
    });

  });

  describe('#asMyItem()', function() {

    it("should convert a single awsItem into an myItem", function() {
      assert.deepEqual([myDesign], Converter.asMyItem(awsDesign));
    });

    it("should convert an awsItem with multiple columns into an array of myItems", function() {
      assert.deepEqual([myDesign, myDesign2], Converter.asMyItem(awsDesign2));
    });

    it("should return the original itemArray if it is empty", function() {
      assert.deepEqual([], Converter.asMyItem([]));
    });

  });

});