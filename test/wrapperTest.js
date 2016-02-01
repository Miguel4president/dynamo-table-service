var assert = require('assert');
var Wrapper = new (require('../dynamoWrapper'))();

// Object setup

var obj = {
  stuff: "value"
}

// Tests

describe('Wrapper', function() {

  describe('constructor', function() {

    it('should have all of the expected functions', function() {
      assert.equal('function', typeof Wrapper.listTables);
      assert.equal('function', typeof Wrapper.describe);
      assert.equal('function', typeof Wrapper.getColumnValues);
      assert.equal('function', typeof Wrapper.getAtKey);
      assert.equal('function', typeof Wrapper.putAtKey);
      assert.equal('function', typeof Wrapper.newTable);
    });

  });

});