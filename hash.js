// forgive me i know this is ass
require('dotenv').config();
const crypto = require('crypto');

var keys = {
  trust: process.env['trustkey'],
  admin: process.env['adminkey'],
  owner: process.env['ownerkey']
}

function generateHash(key1) {
  const key = key1 + Math.floor(Date.now() / 5000);
  const hash = crypto.createHash('sha256');
  hash.update(key);
  return hash.digest('hex').substring(0, 16);
}

module.exports = { generateHash };
