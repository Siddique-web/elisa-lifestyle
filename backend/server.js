const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const io = new Server(server, {
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

  server.listen(PORT, () =>
    console.log(`Servidor Elisa Lifestyle rodando na porta ${PORT}`)
  );
} else {
  app.set('io', null);
}

module.exports = app;
