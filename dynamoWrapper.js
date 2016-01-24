var settings = require('./mySettings');

var _ = require('underscore');
var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  credentials: new AWS.SharedIniFileCredentials({profile: settings.credProfile})
});

var dynamodb = new AWS.DynamoDB();

var DynamoWrapper = function() {
    var converter = settings.converter;

    this.listTables = function(responseObject) {
        dynamodb.listTables(function(err, data) {
            if (err) {
                console.log("error="+err);
                responseObject.send(err);
            } else {
                responseObject.send(data);
            }
        });
    };

    this.describe = function(responseObject, tableId) {
        var params = createDescribeParams(tableId);
        console.log(params);

        dynamodb.describeTable(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                responseObject.send(err);
            } else {
                responseObject.send(data);
            }
        });
    };

    this.column = function(responseObject, tableId, columnName) {
        var params = createScanParams(tableId, [columnName]);

        dynamodb.scan(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            var prettify = parseCustomerList(data).join(' and ');
            responseObject.send(prettify);
          }
        });
    };

    this.getAtKey = function(responseObject, tableId, item) {

        var params = createAwsGetParams(tableId, item);

        dynamodb.getItem(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            responseObject.send(data);
          }
        });
    };

    this.putAtKey = function(responseObject, tableId, itemArray_or_awsItem) {
        var params = createAwsPutParams(tableId, itemArray_or_awsItem);

        dynamodb.putItem(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            responseObject.send(data);
          }
        });
    };

// Holy shnikes, work todo here
    this.newTable = function(responseObject, name, keyArray, attributeArray) {
        var keyArray = [{ AttributeName: "year", KeyType: "HASH"}];
        var attributeArray = [       
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ];

        var params = createNewTableParams("tableName", keyArray, attributeArray);

        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
    };

// Utility functions
    var parseCustomerList = function(scanData) {
        var customers = [];
        _.each(scanData.Items, function(item) {
            customers.push(item.CustomerId.S);
        });
        return customers;
    };

    var createDescribeParams = function(tableId) {
        return { TableName: tableId };
    };

    var createScanParams = function(tableId, attributeArray) {
        var params = {
          TableName: tableId,
          ReturnConsumedCapacity: 'TOTAL',
          Select: 'SPECIFIC_ATTRIBUTES'
        };

        params["AttributesToGet"] = attributeArray;
        return params;
    }

    var createAwsGetParams = function(tableId, item) {
        var param = { 
          TableName: tableId,
          ConsistentRead: false,
          ReturnConsumedCapacity: 'TOTAL'
        }
        param["Key"] = !!converter ? converter.asAwsItem(item) : item;
        return param;
    }

    var createAwsPutParams = function(tableId, itemArray_or_awsItem) {
        var param = {
          TableName: tableId,
          ReturnConsumedCapacity: 'TOTAL',
          ReturnItemCollectionMetrics: 'SIZE',
          ReturnValues: 'NONE'
        };

        param["Item"] = !!converter ? converter.asAwsItem(itemArray_or_awsItem) : itemArray_or_awsItem;
        return param;
    }

    var createNewTableParams = function(tableId, keyArray, attributeArray) {
        var params = {
            TableName : tableId,
            ProvisionedThroughput: {       
                ReadCapacityUnits: 1, 
                WriteCapacityUnits: 1
            }
        };

        param["AttributeDefinitions"] = attributeArray;
        params["KeySchema"] = keyArray;

        return params;
    }
}


module.exports = DynamoWrapper;