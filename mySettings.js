var Converter = new (require('./dynamoConverter'))();

module.exports = {
  port: 3000,
  converter: null,
  credProfile: 'dynamoApp',
  tables: {
    "EasyConfig" : {
      primaryKeyName: 'CustomerId',
      primaryKeyType: 'S',
    }
  }
}

