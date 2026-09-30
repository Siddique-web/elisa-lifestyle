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

app.use('/api/appointments', appointmentsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/staff', staffRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/agendamentos', agendamentosRouter);
app.use('/api/servicos', servicosRouter);

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', storage: isMongoReady() ? 'mongodb' : 'memory' })
);

let mongoStarted = false;
function ensureMongo() {
  if (mongoStarted) return;
  mongoStarted = true;
  connectMongo(process.env.MONGO_URI).catch(() => {});
}

ensureMongo();

module.exports = app;
