const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'nwitter-reloaded',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

