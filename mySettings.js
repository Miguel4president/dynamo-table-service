var Converter = new (require('./dynamoConverter'))();

module.exports = {
  port: 3000,
  converter: undefined,
  credProfile: 'dynamoApp',
}

