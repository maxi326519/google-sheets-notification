import nodemailer from "nodemailer";

export async function sendEmail(
  email: string,
  apoderado: string,
  radicado: string,
  mensaje: string
) {
  // Configura el transporter para Hotmail usando Nodemailer
  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.MICROSOFT_EMAIL,
      pass: process.env.MICROSOFT_PASSWORD,
    },
  });

  // Configura el contenido del correo
  let mailOptions = {
    from: process.env.MICROSOFT_EMAIL,
    to: email,
    subject: "Notificación de proceso",
    html: `<p>Apreciado(a) doctor(a) ${apoderado} se genera automáticamente alerta del proceso ${radicado}, con siguiente mensaje: ${mensaje}</p>`,
  };

  // Enviar el correo electrónico
  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado: ", radicado, email);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}
