import { env } from '@/env/client.mjs';
import NextImage from 'next/image';
import { IKImage } from 'imagekitio-react';

import type { ImageProps } from 'next/image';
import type { IKImageProps } from 'imagekitio-react/dist/types/components/IKImage/combinedProps';
import { useState } from 'react';

type Props = IKImageProps &
ImageProps & {
  src: string;
};

const getIKIProps = (props: Props): IKImageProps => {
  const { src, ...rest } = props;
  const urlEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL;
  const path = src.replace(/https:\/\/ik\.imagekit\.io\/[^/]+\//, '');
  const IKIProps = {
    urlEndpoint,
    path,
    ...rest,
  };
  return IKIProps;
};

const getIsPokeImage = (src?: string) => {
  // check the src matches "raw.githubusercontent.com" for the pokemon dummy images
  return src?.match(/https:\/\/raw\.githubusercontent\.com\/[^/]+\//);
};

const getIsIKImage = (src?: string) => src?.match(/https:\/\/ik\.imagekit\.io\/[^/]+\//);

// we use ImageKit for image optimization & hosting
// TODO: use a public image provider to make use of
// the Next.js Image component which is more performant
export const Image = (props: Props) => {
  const isIKImage = getIsIKImage(props.src);
  const isPokeImage = getIsPokeImage(props.src);
  const [hasIKIError, setHasIKIError] = useState(false);

  if (!isIKImage || hasIKIError) {
    return (
      <NextImage
        alt={props.alt || 'image'}
        className={props.className || 'w-full'}
        placeholder="blur"
        blurDataURL="/images/empty-bottle.png"
        width={props.width || 300}
        height={props.height || 300}
        {...props}
        src={!hasIKIError && !isPokeImage ? props.src : '/images/empty-bottle.png'}
      />
    );
  }

  const IKIProps = getIKIProps(props);

  const handleIKIError = () => {
    console.warn('ImageKit error', props.src);
    setHasIKIError(true);
  };

  return (
    <div className="iki-img-container">
      <IKImage
        loading="lazy"
        onError={handleIKIError}
        lqip={{ active: true, quality: 20 }}
        {...IKIProps}
      />
    </div>
  );
};
