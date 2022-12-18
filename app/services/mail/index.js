const nodemailer = require('nodemailer');
const Mustache = require('mustache');
const fs = require('fs');
const { gmail, password } = require('../../config');

// SMTP adalah transportasi utama di Nodemailer untuk mengirimkan pesan.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // default port 587 and secure false
  secure: false, // true for 465, false for other ports
  auth: { // authentication email, type auth default nya login
    user: gmail,
    pass: password
  },
  tls: {
    rejectUnauthorized: false
  }
});

const otpMAIL = async (email, data) => {
  try {
    let template = fs.readFileSync('app/views/email/otp.html', 'utf8');

    let message = {
      from: gmail,
      to: email,
      subject: 'Otp for registration is: ',
      html: Mustache.render(template, data), // Mustache untuk merender template agar bisa dirun dibrowser 
    };
    
    return await transporter.sendMail(message);
  } catch (ex) {
    console.log(ex);
  }
};

module.exports = {otpMAIL};

