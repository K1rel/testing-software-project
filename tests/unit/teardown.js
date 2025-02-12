module.exports = async () => {
    const { con } = require('../../src/config/app-config');
    await con.end();
  };