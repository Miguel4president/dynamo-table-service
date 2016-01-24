# Dynamo Server Wrapper
- Interactwith your DynamoDB using simple http requests to a local server!

This application is a simple AWS DynamoDB Wrapper served on a local node server.
The purpose is to separate the backend data storage from the UI work that is to come.

The node server runs on localhost:3000 by default, easy to change configurations are saved in the 'mySettings.js' file.

The aws-sdk does its own authentication based on a credentials file (~/.aws/credentials). The Profile name is in the 'mySettings.js' with a default of 'dynamoApp'


## What can I do with it?
The target functionality is to let this app run in the background and make saving things to dynamo a little easier.

The endpoints are meant to be straight forward and allow you to create, edit, and read from your dynamo tables through http requests.


## How to get it running!
Pretty straight forward.

1) Clone it.
2) From root directory.
2.1) npm install
2.2) node main
2.3) localhost:3000/status
3) Profit

## Wrapper API
1) listTables    (responseObject)
2) describe      (responseObject, tableId)
3) keys          (responseObject, tableId)
4) getAtKey      (responseObject, tableId, Item*)
5) putAtKey      (responseObject, tableId, itemArray*)
6) newTable      (responseObject, tableId, keyArray, attributeArray)


## URL Mappings from base(PORT is 3000 by default) localhost:PORT
/status - GET
/tables - GET
/table/TABLE_ID - GET/POST
/table/TABLE_ID/column/COLUMN_ID - GET
/table/TABLE_ID/key/KEY - GET/PUT


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