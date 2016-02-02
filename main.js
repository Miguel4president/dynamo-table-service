var settings = require('./mySettings');
var dynamo = new (require('./dynamoWrapper'))();

var app = require('express')();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
    var tableId = req.params.tableId;

    dynamo.describe(res, tableId);
  })
  .post(function(req, res) {
    var tableId = req.params.tableId;
    res.send("POST to table with ID: "+tableId+". Doesn't do anything yet, will be a create.");
  });

app.route('/table/:tableId/column/:column')
  .get(function(req, res) {
    var tableId = req.params.tableId;
    var column = req.params.column;

    dynamo.getColumnValues(res, tableId, column);
  })
  .put(function(req, res) {
    res.send("PUT to column. This has no effect.");
    res.end();
  })
  .delete(function(req, res) {
    res.send("DELETE to column. This has no effect.");
    res.end();
  })
  .post(function(req, res) {
    res.send("POST to column. This has no effect.");
    res.end();
  });


// Table and Key Specific
app.route('/table/:tableId/key/:key')
  .get(function(req, res) {
    var primaryKey = req.params.key;
    var tableId = req.params.tableId;

    dynamo.getAtKey(res, tableId, primaryKey);
  })
  .put(function(req, res) {
    // myNotation requires an array, awsNotation requires a map
    var primaryKey = req.params.key;
    var tableId = req.params.tableId;
    var columnObjs = JSON.parse(req.body.columnInfo);

    dynamo.putAtKey(res, tableId, primaryKey, columnObjs);
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