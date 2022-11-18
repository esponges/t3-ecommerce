import { Product } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '../atoms/button';

type Props = Partial<Product> & {
  onClick?: () => void;
};

export const ProductCard = ({ name, price, description, image, id, onClick }: Props) => {
  const router = useRouter();

  const handleDetailsClick = () => {
    if (id) {
      void router.push(`/product/${id}`);
    }
  };

  return (
    <div className="group relative sm:w-[50%] md:w-[33%] lg:w-[25%]">
      <div
        className="aspect-w-1 aspect-h-1 lg:aspect-none 
        w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75"
      >
        <Image
          src={image ?? '/empty-bottle.png'}
          width={50}
          height={50}
          layout="responsive"
          alt={description}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full cursor-pointer"
          onClick={onClick}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href="#">
              <span>{name}</span>
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div>
          <p className="text-right text-sm font-medium text-gray-900">{price}</p>
          {/* add to cart */}
          <Button onClick={() => console.log('to do')} variant="primary" extraClassName="mt-2">
            Add
          </Button>
          <Button onClick={handleDetailsClick} variant="primary" extraClassName="mt-2">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};
