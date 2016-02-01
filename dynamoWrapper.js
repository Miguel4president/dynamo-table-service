var settings = require('./mySettings');
var paramBuilder = require('./modelBuilder');

var _ = require('underscore');
var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  credentials: new AWS.SharedIniFileCredentials({profile: settings.credProfile})
});

var dynamodb = new AWS.DynamoDB();

var DynamoWrapper = function() {

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
        var params = paramBuilder.createAwsDescribeParams(tableId);
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

    this.getColumnValues = function(responseObject, tableId, columnName) {
        var params = paramBuilder.createAwsScanParams(tableId, [columnName]);

        dynamodb.scan(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            var prettify = paramBuilder.parseCustomerList(data).join(' and ');
            responseObject.send(prettify);
          }
        });
    };

    this.getAtKey = function(responseObject, tableId, primaryKey) {
        // TODO key thing;


        var params = paramBuilder.createAwsGetParams(tableId, primaryKey);

        dynamodb.getItem(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            responseObject.send(data);
          }
        });
    };

    this.putAtKey = function(responseObject, tableId, primaryKey, columnObjs) {
        var params = paramBuilder.createAwsPutParams(tableId, primaryKey, columnObjs);

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

        var params = paramBuilder.createNewTableParams("tableName", keyArray, attributeArray);

        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
    };

}


module.exports = DynamoWrapper;