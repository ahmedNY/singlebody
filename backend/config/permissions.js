module.exports.permissions = {
  name: 'permissions',

  adminEmail: process.env.ADMIN_EMAIL || 'admin@singlebody.sd',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin1234',

  afterEvents: [
    'hook:auth:initialized'
  ],

  _hookTimeout: 120000 // I used 60 seconds as my new timeout
};
