const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const createAccessToken = ({ userId, role, jwtSecret, ttl }) => {
  return jwt.sign(
    { id: userId, role },
    jwtSecret,
    { expiresIn: ttl, issuer: 'api' }
  );
};

const createRefreshToken = () => {
  return crypto.randomBytes(48).toString('hex');
};

const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  addDays
};
