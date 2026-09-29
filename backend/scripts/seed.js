require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const { catalogServices } = require('../data/catalogServices');

const staff = [
  {
    name: 'Elisa M.',
    role: 'Cabeleireiro',
    schedule: [
      { day: 'Segunda', start: '08:00', end: '17:00' },
      { day: 'Terça', start: '08:00', end: '17:00' },
      { day: 'Quarta', start: '08:00', end: '17:00' },
      { day: 'Quinta', start: '08:00', end: '17:00' },
      { day: 'Sexta', start: '08:00', end: '18:00' },
      { day: 'Sábado', start: '09:00', end: '15:00' },
    ],
  },
  {
    name: 'Ana T.',
    role: 'Trancista',
    schedule: [
      { day: 'Terça', start: '09:00', end: '18:00' },
      { day: 'Quarta', start: '09:00', end: '18:00' },
      { day: 'Quinta', start: '09:00', end: '18:00' },
      { day: 'Sexta', start: '09:00', end: '18:00' },
      { day: 'Sábado', start: '08:00', end: '16:00' },
    ],
  },
  {
    name: 'Sofia L.',
    role: 'Manicure',
    schedule: [
      { day: 'Segunda', start: '10:00', end: '18:00' },
      { day: 'Quarta', start: '10:00', end: '18:00' },
      { day: 'Sexta', start: '10:00', end: '18:00' },
      { day: 'Sábado', start: '09:00', end: '14:00' },
    ],
  },
  {
    name: 'Carlos B.',
    role: 'Barbeiro',
    schedule: [
      { day: 'Segunda', start: '09:00', end: '18:00' },
      { day: 'Terça', start: '09:00', end: '18:00' },
      { day: 'Quinta', start: '09:00', end: '18:00' },
      { day: 'Sexta', start: '09:00', end: '19:00' },
      { day: 'Sábado', start: '08:00', end: '15:00' },
    ],
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await Service.deleteMany({});
  await Staff.deleteMany({});

  await Service.insertMany(catalogServices.map((s) => ({ ...s, active: true })));
  await Staff.insertMany(staff);

  console.log(`Seed concluído: ${catalogServices.length} serviços (sem duplicatas) e ${staff.length} profissionais.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
