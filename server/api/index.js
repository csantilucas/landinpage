const handler = require('../dist/server.js').default;

module.exports = async (req, res) => {
  return handler(req, res);
};
