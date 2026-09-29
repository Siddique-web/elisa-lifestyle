const express = require('express');
const Appointment = require('../models/Appointment');
const { isMongoReady } = require('../db/connection');
const appointmentStore = require('../store/appointmentStore');
const reportHelpers = require('../store/reportHelpers');

const router = express.Router();

const GROUP_FORMAT = {
  day: '%Y-%m-%d',
  week: '%Y-W%V',
  month: '%Y-%m',
};

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from, to };
}

router.get('/volume', async (req, res) => {
  try {
    const groupBy = GROUP_FORMAT[req.query.groupBy] ? req.query.groupBy : 'day';
    const { from: defaultFrom, to: defaultTo } = defaultRange();
    const from = req.query.from ? new Date(req.query.from) : defaultFrom;
    const to = req.query.to ? new Date(req.query.to) : defaultTo;

    if (!isMongoReady()) {
      const items = await appointmentStore.listInRange(from, to, { excludeCancelled: true });
      return res.json({
        groupBy,
        from,
        to,
        series: reportHelpers.volumeSeries(items, groupBy),
      });
    }

    const pipeline = [
      {
        $match: {
          dateTime: { $gte: from, $lte: to },
          status: { $ne: 'Cancelado' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: GROUP_FORMAT[groupBy], date: '$dateTime' } },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $reduce: {
                input: '$services',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.price'] },
              },
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const data = await Appointment.aggregate(pipeline);

    res.json({
      groupBy,
      from,
      to,
      series: data.map((row) => ({
        period: row._id,
        appointments: row.count,
        revenue: row.revenue,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar relatório de volume.' });
  }
});

router.get('/status-summary', async (req, res) => {
  try {
    const { from: defaultFrom, to: defaultTo } = defaultRange();
    const from = req.query.from ? new Date(req.query.from) : defaultFrom;
    const to = req.query.to ? new Date(req.query.to) : defaultTo;

    if (!isMongoReady()) {
      const items = await appointmentStore.listInRange(from, to);
      return res.json({
        from,
        to,
        byStatus: reportHelpers.statusSummary(items),
      });
    }

    const summary = await Appointment.aggregate([
      { $match: { dateTime: { $gte: from, $lte: to } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      from,
      to,
      byStatus: summary.map((s) => ({ status: s._id, count: s.count })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao resumir estados.' });
  }
});

router.get('/trends', async (req, res) => {
  try {
    const { from: defaultFrom, to: defaultTo } = defaultRange();
    const from = req.query.from ? new Date(req.query.from) : defaultFrom;
    const to = req.query.to ? new Date(req.query.to) : defaultTo;

    let historical;
    let byHour;

    if (!isMongoReady()) {
      const items = await appointmentStore.listInRange(from, to);
      historical = reportHelpers.dailyHistorical(items);
      byHour = reportHelpers.peakHours(items);
    } else {
      historical = await Appointment.aggregate([
      {
        $match: {
          dateTime: { $gte: from, $lte: to },
          status: { $in: ['Confirmado', 'Concluído', 'Pendente'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

      byHour = await Appointment.aggregate([
      {
        $match: {
          dateTime: { $gte: from, $lte: to },
          status: { $ne: 'Cancelado' },
        },
      },
      {
        $group: {
          _id: { $hour: '$dateTime' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    }

    const counts = historical.map((h) => h.count);
    const avg =
      counts.length > 0 ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
    const last = counts.slice(-7);
    const recentAvg =
      last.length > 0 ? last.reduce((a, b) => a + b, 0) / last.length : avg;
    const growth = avg > 0 ? (recentAvg - avg) / avg : 0;

    const forecast = [];
    const cursor = new Date(to);
    for (let i = 1; i <= 14; i += 1) {
      cursor.setDate(cursor.getDate() + 1);
      const weekday = cursor.getDay();
      const weekendBoost = weekday === 0 || weekday === 6 ? 1.25 : 1;
      const predicted = Math.max(
        0,
        Math.round(recentAvg * (1 + growth * 0.5) * weekendBoost)
      );
      forecast.push({
        period: cursor.toISOString().slice(0, 10),
        predicted,
        type: 'forecast',
      });
    }

    const historicalSeries = historical.map((h) => ({
      period: h._id,
      actual: h.count,
      type: 'historical',
    }));

    res.json({
      from,
      to,
      historical: historicalSeries,
      forecast,
      peakHours: byHour.map((h) => ({
        hour: `${String(h._id).padStart(2, '0')}:00`,
        count: h.count,
      })),
      insight: {
        averageDailyAppointments: Math.round(avg * 10) / 10,
        recentTrendPercent: Math.round(growth * 1000) / 10,
        busiestHour:
          byHour.length > 0
            ? `${String(byHour.reduce((best, h) => (h.count > best.count ? h : best), byHour[0])._id).padStart(2, '0')}:00`
            : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao calcular tendências.' });
  }
});

router.get('/export-data', async (req, res) => {
  try {
    const { from: defaultFrom, to: defaultTo } = defaultRange();
    const from = req.query.from ? new Date(req.query.from) : defaultFrom;
    const to = req.query.to ? new Date(req.query.to) : defaultTo;

    let appointments;
    if (!isMongoReady()) {
      appointments = await appointmentStore.listInRange(from, to);
    } else {
      appointments = await Appointment.find({
        dateTime: { $gte: from, $lte: to },
      })
        .populate('staffMember', 'name role')
        .sort({ dateTime: 1 });
    }

    const rows = appointments.map((a) => ({
      data: new Date(a.dateTime).toISOString(),
      cliente: a.clienteName,
      telefone: a.clientePhone,
      profissional: a.staffMember?.name || '—',
      servicos: a.services.map((s) => s.name).join(', '),
      valorTotal: a.services.reduce((sum, s) => sum + s.price, 0),
      status: a.status,
    }));

    res.json({ from, to, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao preparar dados para exportação.' });
  }
});

module.exports = router;
