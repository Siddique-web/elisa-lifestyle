require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectMongo, isMongoReady } = require('./db/connection');

const appointmentsRouter = require('./routes/appointments');
const servicesRouter = require('./routes/services');
const staffRouter = require('./routes/staff');
const reportsRouter = require('./routes/reports');
const agendamentosRouter = require('./routes/agendamentos');
const servicosRouter = require('./routes/servicos');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

function mountApi(prefix) {
  app.use(`${prefix}/appointments`, appointmentsRouter);
  app.use(`${prefix}/services`, servicesRouter);
  app.use(`${prefix}/staff`, staffRouter);
  app.use(`${prefix}/reports`, reportsRouter);
  app.use(`${prefix}/agendamentos`, agendamentosRouter);
  app.use(`${prefix}/servicos`, servicosRouter);
  app.get(`${prefix}/health`, (req, res) =>
    res.json({ status: 'ok', storage: isMongoReady() ? 'mongodb' : 'memory' })
  );
}

mountApi('/api');
mountApi('');

let mongoStarted = false;
function ensureMongo() {
  if (mongoStarted) return;
  mongoStarted = true;
  connectMongo(process.env.MONGO_URI).catch(() => {});
}

ensureMongo();

module.exports = app;
