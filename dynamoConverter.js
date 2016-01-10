
var _ = require('underscore');

var Converter = function() {

  var objectDesign = {
    type: "S",
    name: "fieldName",
    value: "valueOfSaidField"
  }

  this.itemsToAwsNotation = function(table, customer, itemArray) {
    var param = {
      TableName: table,
      Item: {
        "CustomerId": { "S": customer }
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'NONE'
    };

    _.each(itemArray, function(item) {
      var object = {};
      object[item.type] = item.value;
      param.Item[item.name] = object;
    });

    return param;
  }

}


module.exports = Converter;