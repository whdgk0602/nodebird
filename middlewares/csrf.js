const { doubleCsrf } = require('csrf-csrf');

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.COOKIE_SECRET,
  getSessionIdentifier: (req) => req.sessionID,
  cookieName: 'x-csrf-token',
  cookieOptions: {
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
  getCsrfTokenFromRequest: (req) => {
    const fromHeader = req.headers['x-csrf-token'];
    if (typeof fromHeader === 'string' && fromHeader.length > 0) return fromHeader;
    if (req.body && typeof req.body._csrf === 'string' && req.body._csrf.length > 0) return req.body._csrf;
    return undefined;
  },
});

module.exports = { generateCsrfToken, doubleCsrfProtection };
