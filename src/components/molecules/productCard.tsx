import { Product } from '@prisma/client';
import Image from 'next/image';

export const ProductCard = ({ name, price, description, image }: Partial<Product>) => {
  return (
    <div className="group relative sm:w-[50%] md:w-[33%] lg:w-[25%]">
      <div
        className="aspect-w-1 aspect-h-1 lg:aspect-none 
        overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 w-full"
      >
        <Image
          src={image ?? '/empty-bottle.png'}
          width={50}
          height={50}
          layout="responsive"
          alt={description}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0"></span>
              {name}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{price}</p>
      </div>
    </div>
  );
};
