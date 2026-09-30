require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectMongo } = require('./db/connection');

const appointmentsRouter = require('./routes/appointments');
const servicesRouter = require('./routes/services');
const staffRouter = require('./routes/staff');
const reportsRouter = require('./routes/reports');
const agendamentosRouter = require('./routes/agendamentos');
const servicosRouter = require('./routes/servicos');

const app = express();
const server = http.createServer(app);

let io;
if (!process.env.VERCEL) {
  // Only initialize Socket.IO when running as a persistent server (local or non-serverless host)
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('Cliente conectado ao painel:', socket.id);
    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
} else {
  // In Vercel (serverless) environment, Socket.IO and a persistent listener are not started.
  app.set('io', null);
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

app.use('/api/appointments', appointmentsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/staff', staffRouter);
app.use('/api/reports', reportsRouter);

app.use('/api/agendamentos', agendamentosRouter);
app.use('/api/servicos', servicosRouter);

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', storage: require('./db/connection').isMongoReady() ? 'mongodb' : 'memory' })
);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.VERCEL) {
    // Persistent server mode (local/dev or hosts that support long-running processes)
    connectMongo(process.env.MONGO_URI).finally(() => {
      server.listen(PORT, () =>
        console.log(`Servidor Elisa Lifestyle rodando na porta ${PORT}`)
      );
    });
  } else {
    // Serverless environment (Vercel): export the Express app as the handler
    // Attempt to connect to Mongo (best-effort); do not start a listener.
    connectMongo(process.env.MONGO_URI).catch(() => {});
    module.exports = app;
  }
}

startServer();
