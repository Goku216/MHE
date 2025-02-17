import nodemailer from "nodemailer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

// Validate email format
const isValidEmail = (email) => {
  return emailRegex.test(email);
};

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Validate email format
    if (!isValidEmail(to)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Email options
    const mailOptions = {
      from: emailConfig.auth.user,
      to: to,
      subject: subject,
      text: text,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
