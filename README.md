# Dynamo Server Wrapper
- Interactwith your DynamoDB using simple http requests to a local server!

This application is an AWS DynamoDB Wrapper served on a local node server.
The purpose is to separate the backend data storage from the UI work that is to come.

The node server runs on localhost:3000 by default, easy to change configurations are saved in the 'mySettings.js' file.

The aws-sdk does its own authentication based on a credentials file (~/.aws/credentials). The Profile name is in the 'mySettings.js' with a default of 'dynamoApp'

## What can I do with it?
The target functionality is to let this app run in the background and make saving things to dynamo a little easier.

The endpoints are meant to be straight forward and allow you to create, edit, and read from your dynamo tables through http requests.

## Structure
main            -> Defines the Express routes and extracts params off of requests
dynamoWrapper   -> Masks the AWS requests, takes minimal params then creates request.
modelBuilder    -> Builds AWS request objects.
dynamoConverter -> (Optional) Converts between AWS item notation and more explicate notation
mySettings      -> module that holds static settings

## Data Flow
http request -> main -> dynamoWrapper -> modelBuilder -> dynamoWrapper -> respons

## How to get it running!
Pretty straight forward.

1) Clone it.
2) From root directory.
3) npm install.
3.1) mocha (see the tests go nuts!)
4) node main.
5) Profit.

## URL Mappings from base (localhost:PORT)
#/tables
  GET - Returns all tables associated with AWS account.
#/table/TABLE_ID 
  GET - Describes table.
  PUT - Creates table with TABLE_ID.
    Requires JSON body arguments
      keyName - String name for the table Primary Key.
      keyType - Type of Key, is aws format i.e. S/N/B.
#/table/TABLE_ID/column/COLUMN_ID
  GET - Returns that specified column value from every row.
#/table/TABLE_ID/key/KEY - GET/PUT/DELETE
  GET - Returns all row information for specified KEY.
  DELETE - Deletes row and returns the data that was in it.
  PUT - Creates row for KEY in table TABLE_ID
    Requires JSON body arguments
      key - primaryKey for your row
      columnInfo - a map of Column data (example below)

Example of column JSON:
{ 
  "newColumn1" : {"S" : "string value"},
  "newColumn2" : {"N" : 1771}
}


## Wrapper API
1) listTables       ()
2) describe         (tableId)
3) getColumnValues  (tableId, columnName)
4) getRow           (tableId, primaryKey)
5) deleteRow        (tableId, primaryKey)
6) putRow           (tableId, primaryKey, columnMap*)
7) newTable         (tableId, primaryKeyName, primaryKeyType)
8) deleteRow        (tableId)

columnMap: This is default aws notation for storing items i.e.
 ->  map = {"newColumn1":{"S":"string value"},"newColumn2":{"N":1771}}

 - The Wrapper converts all of the AWS APIs ro return a Promise. This way instead of each method requiring a callback you can just set a 'then' on the promise.

## Tests
There are some basic unit tests around the Converter and the modelBuilder. There is also a set of integration tests which actually test the wrapper's ability to read and write from a test db.

By default the Integration tests are skipped because they make live calls to AWS.
To enable, remove the '.skip' in this line from the 'integrationTests.js'
 -> describe.skip('Integration tests', function() {

## Bonus
Aws dynamo object notation can be tricky, so there is a hook for an object converter.
This comes bundled with one that can be used to convert objects with a simple notation to the notation that AWS Dynamo is expecting.

It looks a little like this:

var myDesign = {
  type: "columnTypeHere",
  name: "columnNameHere",
  value: "rowContentsHere"
}

var awsDesign = {
  "columnNameHere" : { "columnTypeHere" : "rowContentsHere" }
}


While the aws notation is shorter, it can make accessing and editing values a little annoying. You can also write your own and replace the one there or leave it null for no conversion!