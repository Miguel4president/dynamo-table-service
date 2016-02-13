var Converter = new (require('./src/dynamoConverter'))();

module.exports = {
  port: 3000,
  converter: null,
  credProfile: 'dynamoApp',
  tables: {
    "EasyConfig" : {
      primaryKeyName: 'CustomerId',
      primaryKeyType: 'S',
    },
    "testTable" : {
      primaryKeyName: 'coolKey',
      primaryKeyType: 'S',
    }
  }
}

