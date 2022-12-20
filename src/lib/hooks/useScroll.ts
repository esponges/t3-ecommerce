import { useEffect, useState } from 'react';

interface Props {
  isMobile: boolean;
  isMounted: boolean;
}

export const useScroll = ({ isMobile, isMounted }: Props) => {
  const [showHeader, setShowHeader] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(typeof window !== 'undefined' ? window.scrollY : 0);
  // todo: move this logic to a hook

  useEffect(() => {
    if (!isMounted || isMobile) {
      return;
    }

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollUp = currentScrollPos < prevScrollPos;

      if (scrollUp) {
        setShowHeader(true);
      } else {
        if (currentScrollPos > 50) {
          setShowHeader(false);
        }
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, isMounted, prevScrollPos]);

  return { showHeader };
};
