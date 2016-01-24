var settings = require('./mySettings');

var app = require('express')();

var dynamo = new (require('./dynamoWrapper'))();

//_____________________TESTING STUFF TO MOVE_________________________
var awsStyle = { "testPut" : {"S" : "harpsichord"}};
var myDynamo = { type: "S", name: "testPut", value: "harpsichord" };

var createAwsItem = function(customer) {
  var item = {
    "CustomerId" : { "S" : customer },
    "fieldName"  : { "S" : "new table params success!"  },
    "numberField": { "N" : "123"    }
  };
  return item;
}
//___________________________________________________________________



// ____________________________________EXPRESS ROUTES____________________________

app.get('/status', function(req, res) {
  console.log("Status hit.");
  res.send("Server is up. Idk about AWS tho.");
});

app.route('/tables')
  .get(function(req, res) {
    dynamo.listTables(res);
  })
  .put(function(req, res) {
    res.send("PUT to tables. his has no effect.");
    res.end();
  })
  .delete(function(req, res) {
    res.send("DELETE to tables. This has no effect.");
    res.end();
  })
  .post(function(req, res) {
    res.send("POST to tables. This has no effect.");
    res.end();
  });

// Table Specific
app.route('/table/:tableId')
  .get(function(req, res) {
    console.log("Describe hit. Describing table: "+req.params.tableId);
    dynamo.describe(res, req.params.tableId);
  })
  .post(function(req, res) {
    res.send("POST to table with ID: "+req.params.tableId+". Doesn't do anything yet, will be a create.");
  });

app.route('/table/:tableId/column/:column')
  .get(function(req, res) {
    console.log("GET to entires.");
    dynamo.column(res, req.params.tableId, req.params.column);
  })
  .put(function(req, res) {
    res.send("PUT to keys. This has no effect.");
    res.end();
  })
  .delete(function(req, res) {
    res.send("DELETE to keys. This has no effect.");
    res.end();
  })
  .post(function(req, res) {
    res.send("POST to keys. This has no effect.");
    res.end();
  });


// Table and Key Specific
app.route('/table/:tableId/key/:key')
  .get(function(req, res) {
    console.log("Get customer table data for : "+req.params.key);
    dynamo.getAtKey(res, req.params.tableId, { "CustomerId" : { "S" : req.params.key }});
  })
  .put(function(req, res) {
    console.log("Put content in the customer table for : "+req.params.key);
    dynamo.putAtKey(res, req.params.tableId, createAwsItem(req.params.key));
  })
  .delete(function(req, res) {
    res.send("Delete from the customer table : "+req.params.key+". This doesn't currently do anything.");
    res.end();
  })
  .post(function(req, res) {
    res.send("Post to the customer table for : "+req.params.key+". This doesn't currently do anything.");
    res.end();
  });


var server = app.listen(settings.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Dynamo Server running at http://%s:%s', host, port);
});