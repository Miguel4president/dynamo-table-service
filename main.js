// Functionality
// 1) Create a new table.
// 2) getItem a row from a table.
// 3) putItem to a row from a table.

var express = require('express');
var app = express();
var _ = require('underscore');

var dynamo = new (require('./dynamoWrapper'))();

var awsStyle = { "testPut" : {"S" : "harpsichord"}};
var myDynamo = { type: "S", name: "testPut", value: "harpsichord" };

// Client specific
app.route('/customer/:customer')
  .get(function(req, res) {
    console.log("Get customer table data for : "+req.params.customer);
    dynamo.getCustomer(res, req.params.customer);
  })
  .put(function(req, res) {
    console.log("Put content in the customer table for : "+req.params.customer);
    dynamo.putCustomer(res, req.params.customer, [myDynamo] );
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


// Non-client-specific
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

app.get('/describe', function(req, res) {
  console.log("Describe hit.");
  dynamo.describe(res);
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});