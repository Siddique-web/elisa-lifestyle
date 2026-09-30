const app = require('../backend/app');

app.set('io', null);

function withApiPrefix(pathname) {
  if (!pathname || pathname === '/') return '/api/health';
  if (pathname.startsWith('/api')) return pathname;
  return `/api${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

module.exports = (req, res) => {
  const raw =
    req.headers['x-invoke-path'] ||
    req.headers['x-forwarded-uri'] ||
    req.url ||
    '/';
  const [pathname, query] = String(raw).split('?');
  const urlQuery = (req.url || '').includes('?')
    ? (req.url || '').slice(req.url.indexOf('?') + 1)
    : query;
  req.url = withApiPrefix(pathname) + (urlQuery ? `?${urlQuery}` : '');
  return app(req, res);
};
