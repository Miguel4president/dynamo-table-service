var settings = require('./mySettings');
var _ = require('underscore');

var Builder = {
  converter : settings.converter,

  parseCustomerList : function(scanData, columnName) {
    var customers = [];
    _.each(scanData.Items, function(item) {
        customers.push(item[columnName].S);
    });
    return customers;
  },

  createAwsDescribeParams : function(tableId) {
    return { TableName: tableId };
  },

  createAwsScanParams : function(tableId, attributeNameArray) {
    var params = {
      TableName: tableId,
      ReturnConsumedCapacity: 'TOTAL',
      Select: 'SPECIFIC_ATTRIBUTES'
    };

    params["AttributesToGet"] = attributeNameArray;
    return params;
  },

  createAwsGetParams : function(tableId, primaryKey) {
    var param = { 
      TableName: tableId,
      ConsistentRead: false,
      ReturnConsumedCapacity: 'TOTAL'
    }
    param["Key"] = this.createPrimaryKeyObject(tableId, primaryKey);
    return param;
  },

  createAwsPutParams : function(tableId, key, columnObjs) {
    var valueObject = {};
    valueObject[settings.tables[tableId].primaryKeyType] = key;

    var param = {
      TableName: tableId,
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'NONE'
    }

    var awsItem = !!this.converter ? this.converter.asAwsItem(columnObjs) : columnObjs;
    awsItem[settings.tables[tableId].primaryKeyName] = valueObject;

    param["Item"] = awsItem;
    return param;
  },

  createNewTableParams : function(tableId, keyArray, attributeArray) {
    var params = {
      TableName : tableId,
      ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
      }
    };

    params["AttributeDefinitions"] = attributeArray;
    params["KeySchema"] = keyArray;

    return params;
  },

  createPrimaryKeyObject : function(table, keyValue) {
    var valueObject = {};
    valueObject[settings.tables[table].primaryKeyType] = keyValue;

    var keyObject = {};
    keyObject[settings.tables[table].primaryKeyName] = valueObject;

    return keyObject;
  }

}

module.exports = Builder;