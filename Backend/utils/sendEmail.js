const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log("--- 📧 Starting Email Process ---");
  console.log("Recipient:", options.email);
  try{
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      type:'OAuth2',
      user: process.env.EMAIL_USER, // Your Gmail address
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,   // Not your login password, see note below
    }
  
  });
  await transporter.verify();
    console.log("✅ Server is ready to take our messages");


  // 2. Define email options
  const mailOptions = {
    from: 'RUH Dance Production <${process.env.EMAIL_USER}>',
    to: options.email,
    subject: options.subject,
    html: options.message,
    // html: `<b>${options.message}</b>` // You can use HTML for better design
  };

  const info = await transporter.sendMail(mailOptions);
    console.log("0Auth2 Email sent: " + info.response);
  } catch (error) {
    console.error("0Auth2 Error Details:", error.message); // This will show why it failed
    throw error;
  }
};

module.exports = sendEmail;