import { useEffect, useState } from 'react';

export enum DeviceWidth {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

interface ReturnTypes {
  screen: DeviceWidth;
  isMobile: boolean;
}

export const useDeviceWidth = (): ReturnTypes => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : DeviceWidth.md);

  useEffect(() => {
    if (!window) return;

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDeviceScreenSize = () => {
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

  const isMobile = width < 600;

  return { screen: getDeviceScreenSize(), isMobile };
};
