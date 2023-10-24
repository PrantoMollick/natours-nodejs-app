const nodemailer = require('nodemailer');
// const nodemailerSendgrid = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');
const pug = require('pug');
const htmlToText = require('html-to-text');

if (process.env.NODE_ENV === 'production') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Pranto Mollick <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Send grid
      return;
      // return sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //Send the actual email
  async send(template, subject) {
    //1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define the email options
    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      text: htmlToText.convert(html),
      html,
    };

    // 3) Create a transport and send email
    if (process.env.NODE_ENV === 'production') {
      mailOptions.from = 'em3874@prantomollick.com';
      try {
        const res = await sgMail.send(mailOptions);
        console.log(res[0].statusCode);
        console.log(res[0].headers);
      } catch (error) {
        console.error(error);
      }
    } else {
      await this.newTransport().sendMail(mailOptions);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natour Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
