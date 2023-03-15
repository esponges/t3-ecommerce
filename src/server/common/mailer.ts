/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// had to disable any typesafety to get this working
// there are conflicts with a peerDependency for next-auth v4.14
// that requires nodemailer v6.6.5
// the latest version of @types/nodemailer is v6.4.7
// therefore the types are not compatible here
import { env } from '@/env/server.mjs';
import { env as envClient } from '@/env/client.mjs';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

import type { Product } from '@prisma/client';
import type { OrderWithPayload } from '@/types';

type OrderWithPayloadAndProducts = OrderWithPayload & {
  orderItems: {
    id: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
    productId: string;
    product: Product | undefined;
  }[];
};

export const sendOrderConfirmationEmail = async (
  order: OrderWithPayloadAndProducts,
  userEmail: string,
  userName: string
) => {
  const bankDetails = order.orderDetail?.payment === 'transfer' ? {
    bankName: envClient.NEXT_PUBLIC_BANK_NAME,
    accountName: envClient.NEXT_PUBLIC_BANK_ACCOUNT_NAME,
    accountNumber: envClient.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER,
    accountCLABE: envClient.NEXT_PUBLIC_BANK_ACCOUNT_CLABE,
  } : null;

  const template = path.join(process.cwd(), 'src/server/common/templates/confirmation.ejs');
  const html = await ejs.renderFile(template, { order, userName, bankDetails });

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
    subject: 'Order confirmation',
    html,
  };

  // verify connection configuration
  transporter.verify((error, _success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log(`Email sent: ${info?.response}`);
  });

  // env.ADMIN_EMAILS is a string with a list of emails separated by commas
  // convert to array
  // TODO: get emails from DB instead of env
  const adminEmails = env.ADMIN_EMAILS.split(',').map((email) => email.trim());

  // iterate over admin emails and send a copy of the email to each
  adminEmails.forEach((adminEmail) => {
    const adminMailOptions = {
      from: env.GMAIL_USERNAME,
      to: adminEmail,
      subject: 'New order request',
      html,
    };

    transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log(`Email sent: ${info?.response}`);
    });
  });

  return;
};
