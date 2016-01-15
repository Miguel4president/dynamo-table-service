// Simplify AWS Dynamo SDK
var AWS = require('aws-sdk');
var _ = require('underscore');

AWS.config.update({
  region: 'us-west-2',
  credentials: new AWS.SharedIniFileCredentials({profile: 'dynamoApp'})
});

var dynamodb = new AWS.DynamoDB();

// API
// 1) setConverter  (converter)
// 2) setTableName  (tableName)
// 3) describe      (responseObject)
// 4) listTables    (responseObject)
// 5) customers     (responseObject)
// 6) getCustomer   (responseObject, Item*)
// 7) putCustomer   (responseObject, itemArray*)
// 8) newTable      (responseObject, tableName, keyArray, attributeArray)

// ** Item is awsForm or myForm (requires converter);
var DynamoWrapper = function(table) {
    var tableName = table;
    var converter;

// 1)
    this.setConverter = function(converter) {
        this.converter = converter;
    }

// 2)
    this.setTableName = function(name) {
        tableName = name;
    }

// 3)
    this.describe = function(responseObject) {
        var params = createDescribeParams();
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

// 4)
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

// 5)
    this.customers = function(responseObject) {
        var params = createScanParams(["CustomerId"]);

        dynamodb.scan(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            var prettify = parseCustomerList(data).join(' and ');
            responseObject.send(prettify);
          }
        });
    }

// 6)
    this.getCustomer = function(responseObject, item) {

        var params = createAwsGetParams(item);

        dynamodb.getItem(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            responseObject.send(data);
          }
        });
    }

// 7)
    this.putCustomer = function(responseObject, itemArray_or_awsItem) {
        var params = createAwsPutParams(itemArray_or_awsItem);

        dynamodb.putItem(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            responseObject.send(data);
          }
        });
    }

// 8)
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

    var createDescribeParams = function(options) {
        if (options) {
            console.log("Describe params aren't used, but they were provided:");
            console.log(options);
        }

        var params = {
            TableName: tableName
        };

        return params;
    }

    var createScanParams = function(attributeArray) {
        var params = {
          TableName: tableName,
          ReturnConsumedCapacity: 'TOTAL',
          Select: 'SPECIFIC_ATTRIBUTES'
        };

        params["AttributesToGet"] = attributeArray;
        return params;
    }

    var createAwsGetParams = function(item) {
        var param = { 
          TableName: table,
          ConsistentRead: false,
          ReturnConsumedCapacity: 'TOTAL'
        }
        param["Key"] = !!converter ? converter.asAwsItem(item) : item;
        return param;
    }

    var createAwsPutParams = function(itemArray_or_awsItem) {
        var param = {
          TableName: table,
          ReturnConsumedCapacity: 'TOTAL',
          ReturnItemCollectionMetrics: 'SIZE',
          ReturnValues: 'NONE'
        };

        param["Item"] = !!converter ? converter.asAwsItem(itemArray_or_awsItem) : itemArray_or_awsItem;
        return param;
    }

    var createNewTableParams = function(tableName, keyArray, attributeArray) {

        var params = {
            TableName : tableName,
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