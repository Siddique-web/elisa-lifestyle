import StaffScheduleMatrix from '../components/StaffScheduleMatrix';

export default function AdminStaffPage() {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="section-title">Agenda da equipa</h2>
        <p className="section-sub">
          Escalas semanais e alocação de clientes por profissional e horário.
        </p>
      </div>
      <StaffScheduleMatrix />
    </div>
  );
}
