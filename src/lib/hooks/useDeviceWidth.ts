import { useEffect, useState } from 'react';

export enum DeviceWidth {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export const useDeviceWidth = (): { screen: DeviceWidth } => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getWidth = () => {
    switch (true) {
      case width < 600:
        return DeviceWidth.xs;
      case width < 960:
        return DeviceWidth.sm;
      case width < 1280:
        return DeviceWidth.md;
      case width < 1920:
        return DeviceWidth.lg;
      default:
        return DeviceWidth.xl;
    }
  };

  return { screen: getWidth() };
};
