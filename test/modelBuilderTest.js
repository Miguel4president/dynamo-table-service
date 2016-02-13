var assert = require('assert');
var _ = require('underscore');
var Builder = require('../src/modelBuilder');
var Converter = new (require('../src/dynamoConverter'))();

// Object setup
var tableName = 'EasyConfig';
var scanAttributeArray = ['attr1', 'attr2'];
var primaryKeyName = "CustomerId";
var primaryKey = "bob";

var newTable = {
  name: "testTable",
  keyName: "coolKey",
  keyType: "S",
  keyObject: { AttributeName: 'coolKey', KeyType: 'HASH'},
  attributeObject: { AttributeName: 'coolKey', AttributeType: 'S'}
};

var validNewTableParams = {
  TableName : newTable.name,
  ProvisionedThroughput: {       
      ReadCapacityUnits: 1, 
      WriteCapacityUnits: 1
  },
  KeySchema: [newTable.keyObject],
  AttributeDefinitions: [newTable.attributeObject]
}

var awsKeyObject = {};
awsKeyObject[primaryKeyName] = { "S" : "bob" };

var myKeyObject = {type: "S",value: "bob"}; 
myKeyObject["name"] = primaryKeyName;

var awsColumnObjects = {"newColumn1":{"S":"value"},"newColumn2":{"S":"value2"}};
var myColumnObjects = [ { name: "newColumn1",type: "S",value: "value"},
                        { name: "newColumn2",type: "S",value: "value2"}];

// Valid Result Objects
var idealScanData = {
  Items: [ { CustomerId: {"S" : "bob"} }, { CustomerId: {"S" : "nandan"} } ],
  Count: 2,
  ScannedCount: 2,
  ConsumedCapacity: { TableName: tableName, CapacityUnits: 0.5 }
};

var emptyScanData = {
  Items: [],
  Count: 0,
  ScannedCount: 2,
  ConsumedCapacity: { TableName: tableName, CapacityUnits: 0.5 }
};

var awsScanParams = {
  TableName: tableName,
  ReturnConsumedCapacity: 'TOTAL',
  Select: 'SPECIFIC_ATTRIBUTES',
  AttributesToGet : scanAttributeArray
};

var awsGetParams = {
  TableName: tableName,
  ConsistentRead: false,
  ReturnConsumedCapacity: 'TOTAL',
  Key: awsKeyObject
};

var awsPutParams = {
  TableName: tableName,
  ReturnConsumedCapacity: 'TOTAL',
  ReturnItemCollectionMetrics: 'SIZE',
  ReturnValues: 'NONE',
  Item: {
    "CustomerId": {"S": "bob"},
    "newColumn1": {"S": "value"},
    "newColumn2": {"S": "value2"}
  }
}

var awsDeleteRowParams = {
  TableName: 'EasyConfig',
  ReturnConsumedCapacity: 'TOTAL',
  ReturnItemCollectionMetrics: 'SIZE',
  ReturnValues: 'ALL_OLD',
  Key: awsKeyObject
}


// Required Fields
var requiredFields = {
  describe : ['TableName'],
  deleteTable : ['TableName'],
  get : ['TableName', 'ConsistentRead', 'ReturnConsumedCapacity', 'Key'],
  scan : ['TableName', 'ReturnConsumedCapacity', 'Select', 'AttributesToGet'],
  put : ['TableName', 'ReturnConsumedCapacity', 'ReturnItemCollectionMetrics', 'ReturnValues', 'Item'],
  deleteRow : ['TableName', 'ReturnConsumedCapacity', 'ReturnItemCollectionMetrics', 'ReturnValues', 'Key'],
  newTable : ['TableName', 'ProvisionedThroughput', 'AttributeDefinitions', 'KeySchema']
};

// Test Builders
var requiredFieldTestTitle = function(itemType, converterBoolean) {
  var fieldNumber = requiredFields[itemType].length;
  var converterText = converterBoolean ? " WITH a converter" : " WITHOUT a converter";

  var testTitle = "should have all " + fieldNumber + " of the fields required for " + itemType + converterText;
  return testTitle;
};

var testRequiredFieldsFor = function(itemType , objectToTest) {
  var fields = requiredFields[itemType];
  var fieldNumber = fields.length;
  var myFields = 0;

  _.each(fields, function(fieldName) {
    assert.notEqual(objectToTest[fieldName], undefined);
    assert.notEqual(objectToTest[fieldName], null);
    myFields++;
  });

  assert.equal(myFields, fieldNumber);
};


// Tests

describe('Builder', function() {

  describe('constructor', function() {

    it('should have all of the expected functions', function() {
      assert.equal('function', typeof Builder.parseCustomerList);
      assert.equal('function', typeof Builder.createAwsDescribeParams);
      assert.equal('function', typeof Builder.createAwsScanParams);
      assert.equal('function', typeof Builder.createAwsGetParams);
      assert.equal('function', typeof Builder.createAwsPutParams);
      assert.equal('function', typeof Builder.createNewTableParams);
    });

  });

  describe('#parseCustomerList()', function() {
    it('should return an array of values for ideal scan data', function() {
      assert.deepEqual(Builder.parseCustomerList(idealScanData, primaryKeyName), ['bob', "nandan"]);
    });

    it('should return return an empty array if there is no scan data', function() {
      assert.deepEqual(Builder.parseCustomerList(emptyScanData, primaryKeyName), []);
    });
  });

  describe('#createAwsDescribeParams()', function() {
    it(requiredFieldTestTitle('describe', false), function() {
      testRequiredFieldsFor('describe', Builder.createAwsDescribeParams(tableName));
    });

    it('should return a valid describe param', function() {
      var param = Builder.createAwsDescribeParams(tableName);
      assert(param["TableName"], tableName);
    });
  });

  describe('#createAwsScanParams()', function() {
    it(requiredFieldTestTitle('scan', false), function() {
      testRequiredFieldsFor('scan', Builder.createAwsScanParams(tableName, scanAttributeArray));
    });

    it('should return a valid scan param', function() {
      assert.deepEqual(Builder.createAwsScanParams(tableName, scanAttributeArray), awsScanParams);
    });
  });

  describe('#createAwsGetParams()', function() {
    it(requiredFieldTestTitle('get', true), function() {
      Builder.converter = Converter;
      testRequiredFieldsFor('get', Builder.createAwsGetParams(tableName, primaryKey));
    });

    it(requiredFieldTestTitle('get', false), function() {
      Builder.converter = null;
      testRequiredFieldsFor('get', Builder.createAwsGetParams(tableName, primaryKey));
    });

    it('should return a valid param WITHOUT a converter', function() {
      Builder.converter = null;
      assert.deepEqual(Builder.createAwsGetParams(tableName, primaryKey), awsGetParams);
    });

    it('should return a valid param WITH a converter', function() {
      Builder.converter = Converter;
      assert.deepEqual(Builder.createAwsGetParams(tableName, primaryKey), awsGetParams);
    });
  });

  describe('#createAwsPutParams()', function() {

    it(requiredFieldTestTitle('put', true), function() {
      Builder.converter = Converter;
      testRequiredFieldsFor('put' , Builder.createAwsPutParams(tableName, 'bob', myColumnObjects));
    });

    it(requiredFieldTestTitle('put', false), function() {
      Builder.converter = null;
      testRequiredFieldsFor('put' , Builder.createAwsPutParams(tableName, 'bob', myColumnObjects));
    });

    it('should return a valid param WITH a converter', function() {
      Builder.converter = Converter;
      assert.deepEqual(Builder.createAwsPutParams(tableName, 'bob', myColumnObjects), awsPutParams);
    });

    it('should return a valid param WITHOUT a converter', function() {
      Builder.converter = null;
      assert.deepEqual(Builder.createAwsPutParams(tableName, 'bob', awsColumnObjects), awsPutParams);
    });


  });

  describe('#createAwsDeleteRowParams()', function() {

    it(requiredFieldTestTitle('deleteRow', false), function() {
      Builder.converter = null;
      testRequiredFieldsFor('deleteRow', Builder.createAwsDeleteRowParams(tableName, 'bob'));
    });

    it('should return a valid param WITHOUT a converter', function() {
      Builder.converter = null;
      assert.deepEqual(Builder.createAwsDeleteRowParams(tableName, 'bob'), awsDeleteRowParams);
    });

  });

  describe('#createNewTableParams()', function() {
    it(requiredFieldTestTitle('newTable', false), function() {
      testRequiredFieldsFor('newTable', Builder.createNewTableParams(tableName, newTable.keyName, newTable.keyType));
    });

    it('should return a valid newTable param', function() {
      Builder.converter = null;
      assert.deepEqual(Builder.createNewTableParams(newTable.name, newTable.keyName, newTable.keyType), validNewTableParams);
    });
  });

  describe('#createDeleteTableParams()', function() {
    it(requiredFieldTestTitle('deleteTable', false), function() {
      testRequiredFieldsFor('deleteTable', Builder.createDeleteTableParams(tableName));
    });

    it('should return a valid deleteTable param', function() {
      var param = Builder.createDeleteTableParams(tableName);
      assert(param["TableName"], tableName);
    });
  })
});