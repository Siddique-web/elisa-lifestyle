import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function VolumeBarChart({ data }) {
  if (!data?.length) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">Sem dados de volume no período.</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAD9C8" />
        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="appointments"
          name="Agendamentos"
          fill="#D4AF37"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="right"
          dataKey="revenue"
          name="Receita (Mt)"
          fill="#4A3B32"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendsLineChart({ historical, forecast }) {
  const combined = [
    ...(historical || []).map((d) => ({
      period: d.period,
      actual: d.actual,
      predicted: null,
    })),
    ...(forecast || []).map((d) => ({
      period: d.period,
      actual: null,
      predicted: d.predicted,
    })),
  ];

  if (!combined.length) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">
        Dados insuficientes para tendências.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={combined} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAD9C8" />
        <XAxis dataKey="period" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          name="Histórico"
          stroke="#D4AF37"
          strokeWidth={2}
          dot={false}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          name="Previsão (AI Insights)"
          stroke="#4A3B32"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PeakHoursBarChart({ peakHours }) {
  if (!peakHours?.length) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">Sem picos de horário registados.</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={peakHours}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAD9C8" />
        <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="count" name="Atendimentos" fill="#D2B48C" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
