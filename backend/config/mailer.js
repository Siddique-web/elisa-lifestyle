const nodemailer = require('nodemailer');

/**
 * Transportador de e-mail. Em produção, use um serviço como Gmail (com senha
 * de app), SendGrid, ou Mailgun. As credenciais ficam em variáveis de
 * ambiente (.env), nunca hardcoded.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true para porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envia a notificação de novo agendamento para o dono da Elisa Lifestyle.
 * @param {object} params
 * @param {object} params.cliente - { nome, telefone, email }
 * @param {Array}  params.servicos - lista de serviços com { nome, preco }
 * @param {number} params.valorTotal
 * @param {string} params.data - data formatada (ex: "20/10/2026")
 * @param {string} params.horario - horário (ex: "14:30")
 */
async function enviarNotificacaoAgendamento({
  cliente,
  servicos,
  valorTotal,
  data,
  horario,
}) {
  const listaServicos = servicos
    .map((s) => `- ${s.nome} — ${s.preco.toFixed(2)} Mt`)
    .join('\n');

  const mailOptions = {
    from: `"Elisa Lifestyle - Site" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_NOTIFICATION_EMAIL,
    subject: `Novo Agendamento: ${cliente.nome} - ${data} às ${horario}`,
    text: `Novo agendamento recebido pelo site Elisa Lifestyle:

Cliente: ${cliente.nome}
Telefone: ${cliente.telefone}
E-mail: ${cliente.email || 'não informado'}

Serviços selecionados:
${listaServicos}

Valor total estimado: ${valorTotal.toFixed(2)} Mt

Data: ${data}
Horário: ${horario}
`,
    html: `
      <h2>Novo agendamento — Elisa Lifestyle</h2>
      <p><strong>Cliente:</strong> ${cliente.nome}</p>
      <p><strong>Telefone:</strong> ${cliente.telefone}</p>
      <p><strong>E-mail:</strong> ${cliente.email || 'não informado'}</p>
      <p><strong>Serviços selecionados:</strong></p>
      <ul>
        ${servicos
          .map((s) => `<li>${s.nome} — ${s.preco.toFixed(2)} Mt</li>`)
          .join('')}
      </ul>
      <p><strong>Valor total estimado:</strong> ${valorTotal.toFixed(2)} Mt</p>
      <p><strong>Data:</strong> ${data}</p>
      <p><strong>Horário:</strong> ${horario}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarNotificacaoAgendamento };
