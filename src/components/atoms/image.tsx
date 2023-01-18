import { env } from '@/env/client.mjs';
import { IKImage } from 'imagekitio-react';
import type { IKImageProps } from 'imagekitio-react/dist/types/components/IKImage/combinedProps';

type Props = IKImageProps & {
  path: string;
};

// we use ImageKit for image optimization & hosting
export const Image = ({ ...props }: Props) => {
  const getRelativeUrl = (path: string): string => {
    if (!path) return '';
    // remove the https://ik.imagekit.io/5wjtgrwr1/ part
    const relativeUrl = path.replace(/https:\/\/ik\.imagekit\.io\/[^/]+\//, '');
    return relativeUrl;
  };

  const urlEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL;
  const path = getRelativeUrl(props.path || '');

  return (
    <IKImage 
      urlEndpoint={urlEndpoint} 
      {...props}
      // if props are passed in after, they will override the path
      path={path} 
    />
  );
};
