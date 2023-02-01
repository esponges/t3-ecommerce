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
  userName: string,
) => {
  const template = path.join(process.cwd(), 'src/server/common/templates/confirmation.ejs');
  const html = await ejs.renderFile(template, { order, userName });

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
    subject: 'Confirmación de tu pedido en Vinoreo',
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
};
