const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

let transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

module.exports = transporter;
