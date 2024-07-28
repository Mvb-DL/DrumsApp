import nodemailer from 'nodemailer';

export async function POST(request) {
  const { to, subject, text } = await request.json();

  // Erstellen Sie einen Testaccount bei Ethereal Email
  let testAccount = await nodemailer.createTestAccount();

  // Erstellen Sie einen Nodemailer-Transporter mit den Ethereal SMTP-Einstellungen
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true für 465, false für andere Ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Konfigurieren Sie die E-Mail-Optionen
  let mailOptions = {
    from: testAccount.user,
    to,
    subject,
    text,
  };

  try {
    // Senden Sie die E-Mail
    let info = await transporter.sendMail(mailOptions);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return new Response(JSON.stringify({ message: 'Email sent successfully', previewUrl: nodemailer.getTestMessageUrl(info) }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
