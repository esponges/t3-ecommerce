
export const validation = {
  address: {
    required: 'La dirección es requerida',
    minLength: {
      value: 5,
      message: 'La dirección debe tener al menos 5 caracteres',
    },
  },
  city: {
    required: 'La ciudad es requerida',
    minLength: {
      value: 3,
      message: 'La ciudad debe tener al menos 3 caracteres',
    },
  },
  postalCode: {
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
};
