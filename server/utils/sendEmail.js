const sendEmail = async (to, subject, text) => {
  try {
    console.log("Attempting email to:", to);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP verified");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

module.exports = sendEmail;

