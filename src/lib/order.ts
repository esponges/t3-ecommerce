import type { Product } from '@prisma/client';
import { send } from 'emailjs-com';
import { env } from '@/env/client.mjs';

type P = Product & { qty: number };

export const getOrderTotal = (products: P[]): number => {
  return products.reduce((acc, product) => {
    return acc + product.price * product.qty;
  }, 0);
};

export const sendConfirmationEmail = (/* data */) => {
  // send confirmation email
  send(
    // process.env.EMAILJS_SERVICE_ID as string,
    env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    // process.env.EMAILJS_TEMPLATE_ID as string
    env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    {
      // update email body with the order details and real user details
      message_html: 'test',
      to_name: 'Buyer',
      to_email: 'esponges@gmail.com',
      from_name: 'cool shop',
      // reply_to: process.env.EMAILJS_FROM_EMAIL as string,
      reply_to: env.NEXT_PUBLIC_EMAILJS_FROM_EMAIL,
    },
    // process.env.EMAILJS_USER_ID_PUBLIC_KEY as string
    env.NEXT_PUBLIC_EMAILJS_USER_ID_PUBLIC_KEY
  )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      // probably redirect to order confirmation page
    })
    .catch((err) => {
      console.log('FAILED...', err);
      // show feedback to user of some of error
    });
};
