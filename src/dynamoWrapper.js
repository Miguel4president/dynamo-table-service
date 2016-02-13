var paramBuilder = require('./modelBuilder');
var _ = require('underscore');
var AWS = require('aws-sdk');

var dynamoWrapper = function(settings) {
  this.settings = settings;  
  AWS.config.update({
    region: 'us-west-2',
    credentials: new AWS.SharedIniFileCredentials({profile: this.settings.credProfile})
  });
  var dynamodb = new AWS.DynamoDB();

  var createPromiseCallback = function(resolve, reject) {
    return function(err, data) {
      err ? reject(Error(err)) : resolve(data);
    };
  }

  this.listTables = function() {

    return new Promise(function(resolve, reject) {
      dynamodb.listTables(createPromiseCallback(resolve, reject));
    });

  };

  this.describe = function(tableId) {
    var params = paramBuilder.createAwsDescribeParams(tableId);
    return new Promise(function(resolve, reject) {
      dynamodb.describeTable(params, createPromiseCallback(resolve, reject));
    });
  };

  this.getColumnValues = function(tableId, columnName) {
    var params = paramBuilder.createAwsScanParams(tableId, [columnName]);

    return new Promise(function(resolve, reject) {
      dynamodb.scan(params, function(err, data) {
        if (err) {
          reject(Error(err));
        } else {
          var prettyData = paramBuilder.parseCustomerList(data, columnName).join(' and ');
          resolve(prettyData);
        }
      });
    });

  };

  this.getRow = function(tableId, primaryKey) {
    var params = paramBuilder.createAwsGetParams(tableId, primaryKey);

    return new Promise(function(resolve, reject) {
      dynamodb.getItem(params, createPromiseCallback(resolve, reject));
    });
  };

  this.putRow = function(tableId, primaryKey, columnObjs) {
    var params = paramBuilder.createAwsPutParams(tableId, primaryKey, columnObjs);

    return new Promise(function(resolve, reject) {
      dynamodb.putItem(params, createPromiseCallback(resolve, reject));
    });
  };

  this.deleteRow = function(tableId, primaryKey) {
    var params = paramBuilder.createAwsDeleteRowParams(tableId, primaryKey);

    return new Promise(function(resolve, reject) {
        dynamodb.deleteItem(params, createPromiseCallback(resolve, reject));
    });
  };

  this.newTable = function(tableId, primaryKeyName, primaryKeyType) {
    var params = paramBuilder.createNewTableParams(tableId, primaryKeyName, primaryKeyType);

    return new Promise(function(resolve, reject) {
      dynamodb.createTable(params, createPromiseCallback(resolve, reject));
    });
  };

  this.deleteTable = function(tableId) {
    var params = paramBuilder.createDeleteTableParams(tableId);

    return new Promise(function(resolve, reject) {
        dynamodb.deleteTable(params, createPromiseCallback(resolve, reject));
    });
  };

};

module.exports = dynamoWrapper;