const mongoose = require('mongoose');

let mongoReady = false;

function isMongoReady() {
  return mongoReady;
}

async function connectMongo(uri) {
  if (process.env.USE_MONGODB === 'false') {
    console.log('MongoDB desactivado (USE_MONGODB=false) — dados em memória.');
    return false;
  }

  if (!uri) {
    console.warn('MONGO_URI não definido — dados em memória.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    mongoReady = true;
    console.log('Conectado ao MongoDB');
    return true;
  } catch (err) {
    console.warn('MongoDB indisponível — a usar armazenamento local em memória.');
    console.warn(err.message);
    return false;
  }
}

module.exports = { connectMongo, isMongoReady };
