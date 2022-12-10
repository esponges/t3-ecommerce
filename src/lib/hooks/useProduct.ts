import { useState } from 'react';

type Props = {
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
};

export const useProduct = ({ onClick, onAddToCart }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleChangeProductQty = (value: number) => {
    if (quantity + value > 0) {
      setQuantity(quantity + value);
    }
  };

  const handleQtyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (value > 0 || e.target.value === '') {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (onClick) {
      onClick();
    }

    if (onAddToCart) {
      setIsAddingToCart(true);
      onAddToCart(quantity);

      // this will be a request in the future
      // mock for now
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    }
  };

  return {
    quantity,
    isAddingToCart,
    handleChangeProductQty,
    handleQtyInputChange,
    handleAddToCart,
  };
};
