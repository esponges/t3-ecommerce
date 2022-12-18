import { useEffect } from "react";

interface UseOutsideClickProps {
  ref: React.RefObject<HTMLDivElement>;
  onOutsideClick: () => void;
}

/**
 * This Hook can be used for detecting clicks outside the Opened Menu
 */
export const useOutsideClick = ({ ref, onOutsideClick }: UseOutsideClickProps) => {
  useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleOutsideClick(event: MouseEvent, ref: React.RefObject<HTMLDivElement>) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    }
    // Bind
    document.addEventListener("mousedown", (event) => handleOutsideClick(event, ref));
    return () => {
      // dispose
      document.removeEventListener("mousedown", (event) => handleOutsideClick(event, ref));
    };
  }, [ref, onOutsideClick]);
};
