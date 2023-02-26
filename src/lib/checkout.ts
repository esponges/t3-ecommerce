import { PaymentMethods } from "@/types";

export interface CheckoutFormValues {
  address: string;
  city: string;
  postalCode: string;
  selectedPostalCode: string;
  phone: string;
  schedule: string;
  day: string;
  payment: PaymentMethods;
}

export const validation = {
  address: {
    required: 'La dirección es requerida',
    minLength: {
      value: 5,
      message: 'La dirección debe tener al menos 5 caracteres',
    },
  },
  city: {
    required: 'El municipio es requerido',
    minLength: {
      value: 3,
      message: 'El municipio debe tener al menos 3 caracteres',
    },
  },
  postalCode: {
    required: 'El código postal es requerido',
  },
  selectedPostalCode: {
    required: 'El código postal es requerido',
  },
  phone: {
    required: 'El teléfono es requerido',
    // pattern for 10 digits phone number
    pattern: {
      value: /^[0-9]{10}$/,
      message: 'El teléfono debe tener 10 números, sin espacios ni guiones',
    },
  },
  day: {
    required: 'El día es requerido',
  },
  schedule: {
    required: 'El horario es requerido',
  },
  payment: {
    required: 'El método de pago es requerido',
  },
};

const schedule = [
  { key: 1, text: '12:00 a 14:00', value: '12:00 a 14:00' },
  { key: 2, text: '14:00 a 16:00', value: '14:00 a 16:00' },
  { key: 3, text: '16:00 a 18:00', value: '16:00 a 18:00' },
  { key: 4, text: '11:00 a 15:00', value: '11:00 a 15:00' },
];

// this both could be handled in the future from the DB instead of hardcoding it
export const getScheduleOptions = (day: string) => {
  if (day === 'Sábado') {
    return schedule.slice(3);
  }
  return schedule.slice(0, 3);
};

const days = [
  { key: 1, text: 'Lunes', value: 'Lunes' },
  { key: 2, text: 'Martes', value: 'Martes' },
  { key: 3, text: 'Miércoles', value: 'Miércoles' },
  { key: 4, text: 'Jueves', value: 'Jueves' },
  { key: 5, text: 'Viernes', value: 'Viernes' },
  { key: 6, text: 'Sábado', value: 'Sábado' },
];

export const getAvailableDaysOptions = () => {
  // get local time
  const localTime = new Date();

  // get current index of the day
  // 0 is sunday, 1 is monday, 2 is tuesday, etc
  const currentDayIndex = localTime.getDay();

  // if saturday or sunday just return the next three days
  if (currentDayIndex === 6 || currentDayIndex === 0) {
    return days.slice(0, 3);
  }

  // get the next three working days
  // if it's before 10:00 AM, add the current day
  const offset = localTime.getHours() < 10 ? 1 : 0;

  const nextWorkingDays = [];
  // start with the next day and consider the offset
  let index = currentDayIndex - 1 - offset; 

  while (nextWorkingDays.length < 3 + offset) {
    index = (index + 1) % days.length;
    const day = days[index];

    nextWorkingDays.push({
      key: day?.key,
      text: day?.text,
      value: day?.value,
    });
  }

  return nextWorkingDays;
};

export const paymentOptions = [
  {
    label: 'Efectivo al recibir tu pedido',
    value: PaymentMethods.Cash,
  },
  {
    label: 'Transferencia bancaria',
    value: PaymentMethods.Transfer,
  },
];

export const checkoutDefaultValues: CheckoutFormValues = {
  address: '',
  city: '',
  postalCode: '',
  selectedPostalCode: '',
  phone: '',
  schedule: '',
  day: '',
  payment: PaymentMethods.Transfer,
};
