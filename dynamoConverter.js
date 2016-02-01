
var _ = require('underscore');

// Input items have descriptive Keys
var convertToAwsItem = function(itemArray) {
  if (itemArray.length < 1 || !isMyItem(itemArray[0])) {
    return itemArray;
  }

  var newItem = {};

  _.each(itemArray, function(item, key) {
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
      myItem.value = value[key];
    })

    itemArray.push(myItem);
  });

  return itemArray;
}

var isMyItem = function(item) {
  if (item.type == undefined || item.name == undefined || item.value == undefined) {
    return false;
  }
  return true;
}

var Converter = function() {

  this.asAwsItem = function(itemArray) {
    return convertToAwsItem(itemArray);
  }

  this.asMyItem = function(awsItem) {
    return convertToMyItem(awsItem);
  }
}

module.exports = Converter;