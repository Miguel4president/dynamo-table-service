// Simplify AWS Dynamo SDK
var AWS = require('aws-sdk');
var _ = require('underscore');
var Converter = new (require('./dynamoConverter'))();

AWS.config.update({
  region: 'us-west-2',
  credentials: new AWS.SharedIniFileCredentials({profile: 'dynamoApp'})
});

var dynamodb = new AWS.DynamoDB();

var DynamoWrapper = function() {

    // Standardize Stuff
    // var item = {
    //     type: "S",
    //     name: "fieldName",
    //     value: "valueOfSaidField"
    // }
    // customer = String name (primary key)

    // API
    // 1) describe  (responseObject)
    // 2) newTable  (responseObject, tableName) - NOT FINISHED
    // 3) listTables(responseObject)
    // 4) get       (responseObject, customer)
    // 5) put       (responseObject, customer, value) - CONVERT 'value' TO ITEM
    // 6) customers (responseObject)

    this.describe = function(responseObject) {
        var params = {
            TableName: 'EasyConfig'
        };

        dynamodb.describeTable(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                responseObject.send(err);
            } else {
                responseObject.send(data);
            }
        });
    };

    this.newTable = function(responseObject, name) {
        // DONT USE

        var params = {
            TableName : "Test",
            KeySchema: [       
                { AttributeName: "year", KeyType: "HASH"},  //Partition key
                { AttributeName: "title", KeyType: "RANGE" }  //Sort key
            ],
            AttributeDefinitions: [       
                { AttributeName: "year", AttributeType: "N" },
                { AttributeName: "title", AttributeType: "S" }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        };

        dynamodb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
    };

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

    this.getCustomer = function(responseObject, customer) {

        var params = { 
          TableName: 'EasyConfig',
          ConsistentRead: false,
          Key: {
            "CustomerId" : { "S" : customer }
          },
          ReturnConsumedCapacity: 'TOTAL'
        }


        dynamodb.getItem(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            responseObject.send(data);
          }
        });
    }

    this.putCustomer = function(responseObject, customer, itemArray) {

        var params = Converter.itemsToAwsNotation('EasyConfig', customer, itemArray);

        // var params = {
        //   TableName: 'EasyConfig',
        //   Item: {
        //     "CustomerId": { "S" : customer },
        //     "aThing": { "S": toSave },
        //   },
        //   ReturnConsumedCapacity: 'TOTAL',
        //   ReturnItemCollectionMetrics: 'SIZE',
        //   ReturnValues: 'NONE'
        // };

        dynamodb.putItem(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            responseObject.send(err);
          } else {
            responseObject.send(data);
          }
        });
    }


    this.customers = function(responseObject) {
        var params = {
          TableName: 'EasyConfig',
          AttributesToGet: [
            'CustomerId',
          ],
          ReturnConsumedCapacity: 'TOTAL',
          Select: 'SPECIFIC_ATTRIBUTES'
        };

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
}

// Utility functions
var parseCustomerList = function(scanData) {
    var customers = [];
    _.each(scanData.Items, function(item) {
        customers.push(item.CustomerId.S);
    });
    return customers;
};

module.exports = DynamoWrapper;