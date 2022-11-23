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
