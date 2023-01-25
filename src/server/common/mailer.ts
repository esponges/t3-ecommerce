import { env } from '@/env/server.mjs';
import nodemailer from 'nodemailer';

export const sendNodeMailerGmailTest = async () => {
  const transporter = nodemailer.createTransport({
    // configure gmail with app password
    host: 'smtp.gmail.com',
    // port: 465,
    service: 'gmail',
    secure: false,
    auth: {
      user: env.GMAIL_USERNAME,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });
    
  // log envs
  console.log(env.GMAIL_USERNAME, env.GMAIL_APP_PASSWORD);

  const mailOptions = {
    from: env.GMAIL_USERNAME,
    to: 'esponges@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
  };

  // verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
};
