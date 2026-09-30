let app;
try {
  app = require('../_backend/app');
} catch (_err) {
  app = require('../../backend/app');
}

app.set('io', null);

module.exports = app;
