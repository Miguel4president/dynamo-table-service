var settings = require('./mySettings');
var dynamo = new (require('./src/dynamoWrapper'))(settings);

var app = require('express')();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var standardResolve = function(res) {
  return function(result) { res.send(result); };
}

var standardReject = function(res) {
  return function(result) { res.send("Sorry, there was an error: \n"+result); };
}

// ES6 Templating
var unsupportedOp = function(req, res) {
  res.send(`Unsupported Operation: ${req.method} to ${req.url}.`);
  res.end();
}

app.route('/tables')
  .get(function(req, res) {
    dynamo.listTables().then(standardResolve(res), standardReject(res));
  })
  .put(function(req, res) {
    unsupportedOp(req, res);
  })
  .delete(function(req, res) {
    unsupportedOp(req, res);
  })
  .post(function(req, res) {
    unsupportedOp(req, res);
  });

// Table Specific
app.route('/table/:tableId')
  .get(function(req, res) {
    var tableId = req.params.tableId;
    dynamo.describe(tableId).then(standardResolve(res), standardReject(res));
  })
  .put(function(req, res) {
    var tableId = req.params.tableId;
    var keyName = JSON.parse(req.body.keyName);
    var keyType = JSON.parse(req.body.keyType);
    dynamo.newTable(tableId, keyName, keyType).then(standardResolve(res), standardReject(res));
  })
  .delete(function(req, res) {
    var tableId = req.params.tableId;
    dynamo.deleteTable(tableId).then(standardResolve(res), standardReject(res));
  });

app.route('/table/:tableId/column/:column')
  .get(function(req, res) {
    var tableId = req.params.tableId;
    var column = req.params.column;
    dynamo.getColumnValues(tableId, column).then(standardResolve(res), standardReject(res));
  })
  .put(function(req, res) {
    unsupportedOp(req, res);
  })
  .delete(function(req, res) {
    unsupportedOp(req, res);
  })
  .post(function(req, res) {
    unsupportedOp(req, res);
  });


// Table and Key Specific
app.route('/table/:tableId/key/:key')
  .get(function(req, res) {
    var primaryKey = req.params.key;
    var tableId = req.params.tableId;
    dynamo.getRow(tableId, primaryKey).then(standardResolve(res), standardReject(res));
  })
  .put(function(req, res) {
    // myNotation requires an array, awsNotation requires a map
    var primaryKey = req.params.key;
    var tableId = req.params.tableId;
    var columnObjs = JSON.parse(req.body.columnInfo);
    dynamo.putRow(tableId, primaryKey, columnObjs).then(standardResolve(res), standardReject(res));
  })
  .delete(function(req, res) {
    var primaryKey = req.params.key;
    var tableId = req.params.tableId;
    dynamo.deleteRow(tableId, primaryKey).then(standardResolve(res), standardReject(res));
  })
  .post(function(req, res) {
    unsupportedOp(req, res);
  });


var server = app.listen(settings.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Dynamo Server running at http://%s:%s', host, port);
});