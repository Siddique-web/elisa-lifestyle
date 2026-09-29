const {
  resolveServicesFromIds,
  normalizeInlineServices,
} = require('./catalog');

async function buildServicesFromIds(serviceIds) {
  return resolveServicesFromIds(serviceIds);
}

async function buildServicesFromBody({ serviceIds, services }) {
  if (Array.isArray(services) && services.length > 0) {
    return normalizeInlineServices(services);
  }
  return buildServicesFromIds(serviceIds);
}

function combineDateAndTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

module.exports = { buildServicesFromIds, buildServicesFromBody, combineDateAndTime };
