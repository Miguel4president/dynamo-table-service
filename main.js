// Functionality
// 1) Create a new table.
// 2) getItem a row from a table.
// 3) putItem to a row from a table.

var express = require('express');
var app = express();
var _ = require('underscore');

var dynamo = new (require('./dynamoWrapper'))("EasyConfig");
var Converter = new (require('./dynamoConverter'))();

var awsStyle = { "testPut" : {"S" : "harpsichord"}};
var myDynamo = { type: "S", name: "testPut", value: "harpsichord" };

var createAwsItem = function(customer) {
  var item = {
    "CustomerId" : { "S" : customer },
    "fieldName"  : { "S" : "value"  },
    "numberField": { "N" : "123"    }
  };
  return item;
}


// Client Independent
app.get('/describe', function(req, res) {
  console.log("Describe hit.");
  dynamo.describe(res);
});

app.route('/customers')
  .get(function(req, res) {
    console.log("Get to all customers.");
    dynamo.customers(res);
  })
  .put(function(req, res) {
    console.log("Put to all customers.");
    res.send("This has no effect.");
    res.end();
  })
  .delete(function(req, res) {
    console.log("Delete for all customers.");
    res.send("This has no effect.");
    res.end();
  })
  .post(function(req, res) {
    console.log("Post to all customers.");
    res.send("This has no effect.");
    res.end();
  });

app.route('/tables')
  .get(function(req, res) {
    console.log("Get to all tables.");
    dynamo.listTables(res);
  })
  .put(function(req, res) {
    console.log("Put to all tables.");
    res.send("This has no effect.");
    res.end();
  })
  .delete(function(req, res) {
    console.log("Delete to all tables.");
    res.send("This has no effect.");
    res.end();
  })
  .post(function(req, res) {
    console.log("Post to all tables.");
    res.send("This has no effect.");
    res.end();
  });

// Client specific
app.route('/customer/:customer')
  .get(function(req, res) {
    console.log("Get customer table data for : "+req.params.customer);
    dynamo.getCustomer(res, { "CustomerId" : { "S" : req.params.customer }});
  })
  .put(function(req, res) {
    console.log("Put content in the customer table for : "+req.params.customer);
    dynamo.putCustomer(res, createAwsItem(req.params.customer));
  })
  .delete(function(req, res) {
    console.log("Delete from the customer table : "+req.params.customer);
    res.send("This doesn't currently do anything.");
    res.end();
  })
  .post(function(req, res) {
    console.log("Post to the customer table for : "+req.params.customer);
    res.send("This doesn't currently do anything.");
    res.end();
  });


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});