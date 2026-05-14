const nodemailer = require('nodemailer');

/**
 * Send a professional payment receipt/slip via email
 * @param {Object} student - { fullName, email }
 * @param {Object} payment - { amount, category, description, date, paymentMethod }
 */
const sendPaymentSlip = async (student, payment) => {
    try {
        // Create a transporter using environment variables
        // If EMAIL_USER and EMAIL_PASS are not set, it will fail gracefully with a log
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Email credentials not found in .env. Skipping email sending.');
            return { success: false, message: 'Email credentials not configured.' };
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to your SMTP provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"RUH Dance Production" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: `Payment Receipt - ${payment.category}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #722F37; margin: 0;">RUH</h1>
                        <p style="margin: 0; font-size: 12px; letter-spacing: 2px; color: #666;">DANCE PRODUCTION</p>
                    </div>
                    
                    <h2 style="color: #333; border-bottom: 2px solid #722F37; padding-bottom: 10px;">Payment Receipt</h2>
                    
                    <p>Dear <strong>${student.fullName}</strong>,</p>
                    <p>Thank you for your payment. Below are the details of your transaction:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Description:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${payment.description}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Date:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${new Date(payment.date).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Payment Method:</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${payment.paymentMethod}</td>
                        </tr>
                        <tr style="background: #fdf2f3;">
                            <td style="padding: 15px; font-size: 1.2rem; color: #722F37;">Total Paid:</td>
                            <td style="padding: 15px; font-size: 1.2rem; font-weight: bold; color: #722F37;">₹${payment.amount.toLocaleString()}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">
                        <p>If you have any questions, please contact our support.</p>
                        <p>Keep Dancing!</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: ' + info.response);
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, message: 'Error sending email: ' + error.message };
    }
};

module.exports = { sendPaymentSlip };
