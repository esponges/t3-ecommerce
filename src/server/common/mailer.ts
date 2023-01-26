/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// had to disabled any typesafety to get this working
// there are conflicts with a peerDependency for next-auth
// that requires nodemailer v6.6.5
// the latest version of @types/nodemailer is v6.4.7
// therefore the types are not compatible here
import { env } from '@/env/server.mjs';
import nodemailer from 'nodemailer';
import type { OrderWithPayload } from '@/types';
import ejs from 'ejs';
import path from 'path';

export const sendOrderConfirmationEmail = async (order: OrderWithPayload, userEmail: string) => {
  const template = path.join(process.cwd(), 'src/server/common/templates/confirmation.ejs');

  const html = await ejs.renderFile(template, { order, userEmail });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: false,
    auth: {
      user: env.GMAIL_USERNAME,
      // configure gmail with app password
      pass: env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: env.GMAIL_USERNAME,
    to: userEmail,
    subject: 'Order Confirmation',
    html,
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
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log(`Email sent: ${info.response}`);
  });
};
