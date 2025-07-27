const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // tài khoản Gmail
        pass: process.env.EMAIL_PASS        // mật khẩu ứng dụng (app password)
      }
    });

    const mailOptions = {
      from: `"Quiz App" <${process.env.EMAIL_USER}>`, // tên người gửi
      to,               // email người nhận
      subject,          // tiêu đề
      html: htmlContent // nội dung HTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📩 Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("❌ Send mail error:", error);
    return false;
  }
};

module.exports = sendMail;
