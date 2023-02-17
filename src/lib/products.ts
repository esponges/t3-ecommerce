import { DeviceWidth } from './hooks/useDeviceWidth';

export const itemsPerCarrousel = (screen: DeviceWidth): number => {
  switch (screen) {
    case DeviceWidth.xs:
      return 1;
    case DeviceWidth.sm:
      return 2;
    case DeviceWidth.md:
      return 3;
    case DeviceWidth.lg:
      return 4;
    case DeviceWidth.xl:
      return 5;
    default:
      return 3;
  }
};

interface CarrouselStyles {
  wrapper: string;
  // add more
}

export const carrouselStyle = (screen: DeviceWidth): CarrouselStyles => {
  const className: CarrouselStyles = {
    wrapper: '',
  };

  switch (screen) {
    case DeviceWidth.xs:
      className.wrapper = 'px-12';
      break;
    case DeviceWidth.sm:
      className.wrapper = 'px-10';
      break;
    case DeviceWidth.md:
    case DeviceWidth.lg:
    case DeviceWidth.xl:
      className.wrapper = 'px-6';
    default:
      className.wrapper = 'px-2';
      break;
  }

  return className;
};

export const adminProductDetailsSchema = {
  name: {
    required: 'Este valor es requerido',
  },
  description: {
    minLength: {
      value: 10,
      message: 'Debe tener al menos 10 caracteres',
    },
  },
  discount: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
    max: {
      value: 100,
      message: 'No puede ser mayor a 100',
    },
  },
  price: {
    required: 'Este valor es requerido',
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
  },
  image: {
    // must a valid url
    pattern: {
      value: /^https?:\/\/.+/,
      message: 'Debe ser una url válida',
    },
  },
  stock: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
  },
  score: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
    max: {
      value: 10,
      message: 'No puede ser mayor a 10',
    },
  },
  favScore: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
    max: {
      value: 10,
      message: 'No puede ser mayor a 10',
    },
  },
  capacity: {
    // patern for 750ml, 1.5L, 3L, 5L etc
    pattern: {
      value: /^\d+(?:\.\d+)?(?:ml|L)$/,
      message: 'Debe ser una capacidad válida (ej. 750ml, 1L',
    },
    required: 'Este valor es requerido'
  },
  volume: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
    required: 'Este valor es requerido'
  },
  age: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
  country: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
  year: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
  variety: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
};
