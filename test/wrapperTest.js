var assert = require('assert');
var mocha = require('mocha');

var chai = require('chai');
expect = chai.expect;

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var settings = require('../mySettings');
var Wrapper = new (require('../src/dynamoWrapper'))(settings);

// Tests

describe('Wrapper', function() {

  describe('constructor', function() {

    it('should have all of the expected functions', function() {
      console.log(typeof Wrapper.listTables);
      assert.equal('function', typeof Wrapper.listTables);
      assert.equal('function', typeof Wrapper.describe);
      assert.equal('function', typeof Wrapper.getColumnValues);
      assert.equal('function', typeof Wrapper.getRow);
      assert.equal('function', typeof Wrapper.putRow);
      assert.equal('function', typeof Wrapper.newTable);
    });

  });

});