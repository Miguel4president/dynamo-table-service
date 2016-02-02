var assert = require('assert');
var mocha = require('mocha');
var chai = require('chai');
expect = chai.expect;

var Wrapper = new (require('../dynamoWrapper'))();
// Object setup

var mockResponse = function(done) {
  var response = "BLANK";
  var doneObject = done;
  this.send = function(data) {
    response = data;
    doneObject();
  };
  this.hasValidResponse = function() {
    return typeof response.TableNames != undefined;
  };
};

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


// Be careful with this. Async test takes about half a second. All other tests combined take about 20 ms.
  describe("connection", function(){  
    var response = false;

    before(function(done) {
      response = new mockResponse(done);
      Wrapper.listTables(response);
    });

    it("should be able get a non-error response from AWS", function(){
      expect(response.hasValidResponse()).equals(true);
    });
  });

});