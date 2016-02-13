var _ = require('underscore');
var assert = require('assert');
var mocha = require('mocha');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

// Thing to test
var settings = require('../mySettings');
var gen = new (require('../src/dynamoWrapper'))(settings);

// Test data
var testTable = {
  name: "testTable",
  keyName: "coolKey",
  keyType: "S",
  keyObject: { AttributeName: 'coolKey', KeyType: 'HASH'},
  attributeObject: { AttributeName: 'coolKey', AttributeType: 'S'},
  testRowKey: "testRow",
  columnObjects1: {"newColumn1":{"S":"value"},"newColumn2":{"S":"value2"}},
  columnObjects2: {"newColumn1":{"S":"bobs stuff"},"newColumn2":{"S":"not bobs stuff"}},
};
var testItem1 = {"newColumn1": { "S": "value" },
                "coolKey": { "S": "testRow" },
                "newColumn2": { "S": "value2"} };
var testItem2 = {"newColumn1": { "S": "bobs stuff" },
                "coolKey": { "S": "testRow" },
                "newColumn2": { "S": "not bobs stuff"} };

var setDefaultValues = function(done) {
  // Create a new table (delete one if it already exists).
  // Before will only happen once.
  gen.putRow(testTable.name, testTable.testRowKey, testTable.columnObjects1).then(function(result) {
    console.log("Ran the main Before.");
    done();
  }, function(err) {
    throw new Error("Aborting!\n"+err);
  });
};




describe.skip('Integration tests', function() {

  describe('#newTable()', function() {

    after(function(done) {
      setTimeout(function() {
        console.log("Waiting for table to generate.");
        done();
      }, 1800);
    });

    it('should create a new table and return info about it', function() {
      return expect(gen.newTable(testTable.name, testTable.keyName, testTable.keyType))
        .to.eventually.have.property('TableDescription')
        .with.property('AttributeDefinitions')
        .that.deep.equal([testTable.attributeObject]);
    });

    it('should find the new table with the listTables function', function() {
      return expect(gen.listTables()).to.eventually.have.property('TableNames')
        .that.is.an('array')
        .that.contains(testTable.name);
    });

  });

  describe("GET Tests.", function() {

    before(setDefaultValues);

    describe('#listTables()', function() {
      it('should contain an array with the test table', function() {
        return expect(gen.listTables()).to.eventually.have.property('TableNames')
          .that.is.an('array')
          .that.contains(testTable.name);
      });
    });

    describe('#describe()', function() {

      it('should have information on the test table', function() {
        return expect(gen.describe(testTable.name)).to.eventually.have.property("Table")
          .to.have.deep.property('AttributeDefinitions')
          .that.contains(testTable.attributeObject);
      });

    });

    describe('#getColumnValues()', function() {

      it('should find results for each primaryKey', function() {
        return expect(gen.getColumnValues(testTable.name, testTable.keyName))
          .to.eventually.contain(testTable.testRowKey);
      });

    });

    describe('#getRow()', function() {

      it('should find the row with test values', function() {
        return expect(gen.getRow(testTable.name, testTable.testRowKey))
          .to.eventually.have.property("Item")
          .that.deep.equal(testTable.columnObjects1);
      });

    });

  });


  describe('PUT/POST/DELETE Tests.', function() {

    describe('#putRow()', function() {

      it('should put the new row content and return info', function() {
        return expect(gen.putRow(testTable.name, testTable.testRowKey, testTable.columnObjects2))
          .to.eventually.be.fulfilled;
      });

      it('should have actually put the data there', function() {
        return expect(gen.getRow(testTable.name, testTable.testRowKey))
          .to.eventually.have.property("Item")
          .that.deep.equal(testTable.columnObjects2);
      });

    });

    describe('#deleteRow()', function() {

      it('should delete the test row and return the value', function() {
        return expect(gen.deleteRow(testTable.name, testTable.testRowKey))
          .to.eventually.have.property("Attributes")
          .that.deep.equal(testItem2);
      });

      it('should not find the test row anymore', function() {
        return expect(gen.getColumnValues(testTable.name, testTable.keyName))
          .to.eventually.not.contain(testTable.testRowKey);
      })
    });

  });

  describe('#deleteTable()', function() {

    it('should delete the table and return info about it', function() {
      return expect(gen.deleteTable(testTable.name))
        .to.eventually.have.property('TableDescription')
        .with.deep.property('TableStatus', 'DELETING');
    });

  });


});