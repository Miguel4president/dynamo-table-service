
var _ = require('underscore');

var myDesign = {
  type: "S",
  name: "fieldName",
  value: "valueOfSaidField"
}

var awsDesign = {
  "fieldName" : { "S" : "value" }
}

// Input items have descriptive Keys
var convertToAwsItem = function(itemArray) {
  var newItem = {};

  _.each(itemArray, function(item) {
    var valueObject = {};
    valueObject[item.type] = item.value;

    newItem[item.name] = valueObject;
  });
  
  return newItem;
}

// Input item have values as Keys
var convertToMyItem = function(awsItem) {
  var itemArray = [];
  
  // Look at the fields, they have objects in them that will become an element in an array
  _.each(awsItem, function(value, key) {
    var myItem = {};
    myItem.name = key;

    // Loop over the content of the hopefully only item there which will be the type
    _.each(value, function(val, key) {
      myItem.type = key;
      myItem.value = value;
    })

    itemArray.push(myItem);
  });

  return itemArray;
}


var Converter = function(tableName) {
  var table = tableName;

  this.createAwsPutItem = function(itemArray) {
    var param = {
      TableName: table,
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'NONE'
    };

    param["Item"] = !!(itemArray[0].type) ? convertToAwsItem(itemArray) : itemArray;
    return param;
  }

  this.createAwsGetItem = function(item) {
    var param = { 
      TableName: table,
      ConsistentRead: false,
      ReturnConsumedCapacity: 'TOTAL'
    }

    param["Key"] = !!item.type ? convertToAwsItem([item]) : item;
    return param;
  }

  this.asAwsItem = function(itemArray) {
    return convertToAwsItem(itemArray);
  }

  this.asMyItem = function(awsItem) {
    return convertToMyItem(awsItem);
  }


}




module.exports = Converter;