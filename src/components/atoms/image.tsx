import NextImage from 'next/image';
import type { ImageProps } from 'next/image';

export const Image = (props: ImageProps) => {
  return (
    <NextImage
      alt={props.alt || 'image'}
      className={props.className || 'w-full'}
      placeholder="blur"
      blurDataURL="/images/empty-bottle.png"
      width={props.width || 300}
      height={props.height || 300}
      {...props}
    />
  );
};
