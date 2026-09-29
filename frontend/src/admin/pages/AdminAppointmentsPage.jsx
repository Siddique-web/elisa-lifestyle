import AppointmentTable from '../components/AppointmentTable';

export default function AdminAppointmentsPage() {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="section-title">Agendamentos</h2>
        <p className="section-sub">
          Gerencie estados em tempo real. Novos pedidos aparecem automaticamente na lista.
        </p>
      </div>
      <AppointmentTable />
    </div>
  );
}
