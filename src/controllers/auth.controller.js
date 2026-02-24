const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { createAccessToken, createRefreshToken, addDays } = require('../utils/tokens');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  authenticate: async function (req, res) {
    const { token } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      let user = await User.findOne({ where: { google_id: payload.sub } });

      if (!user) {
        user = await User.create({
          google_id: payload.sub,
          name: payload.name,
          email: payload.email,
        });
      }

      const refreshToken = createRefreshToken();
      const refreshExpiresAt = addDays(Number(30));

      await user.update({
        refresh_token: refreshToken,
        refresh_token_expires_at: refreshExpiresAt
      });

      const accessToken = createAccessToken({
        userId: user.id,
        role: user.role,
        jwtSecret: process.env.JWT_SECRET,
        ttl: process.env.ACCESS_TOKEN_TTL  || '15m'
      });

      const sanitizedUser = {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        profile_img: user.profile_img,
        role: user.role
      };

      res.json({ accessToken, refreshToken, user: sanitizedUser });
    } catch (err) {
      res.status(401).json({ error: 'Invalid Google token' });
    }
  },
  refresh: async function (req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Missing refresh token' });
    }

    const user = await User.findOne({ where: { refresh_token: refreshToken } });

    if (!user) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const expiresAt = user.refresh_token_expires_at ? new Date(user.refresh_token_expires_at) : null;

    if (!expiresAt || expiresAt <= new Date()) {
      return res.status(403).json({ error: 'Refresh token expired' });
    }

    const newRefreshToken = createRefreshToken();
    const newRefreshExpiresAt = addDays(Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30));

    await user.update({
      refresh_token: newRefreshToken,
      refresh_token_expires_at: newRefreshExpiresAt
    });

    const accessToken = createAccessToken({
      userId: user.id,
      role: user.role,
      jwtSecret: process.env.JWT_SECRET,
      ttl: process.env.ACCESS_TOKEN_TTL || '15m'
    });

    res.json({ accessToken, refreshToken: newRefreshToken });
  },
  logout: async function (req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }

    const user = await User.findOne({
      where: { refresh_token: refreshToken }
    });

    if (user) {
      await user.update({
        refresh_token: null,
        refresh_token_expires_at: null
      });
    }
    res.json({ ok: true });
  }

};
