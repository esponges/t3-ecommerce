import { env } from '@/env/client.mjs';
import { IKImage } from 'imagekitio-react';
import type { IKImageProps } from 'imagekitio-react/dist/types/components/IKImage/combinedProps';

type Props = IKImageProps & {
  path: string;
};

// we use ImageKit for image optimization & hosting
// TODO: use a public image provider to make use of 
// the Next.js Image component which is more performant
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
      // TODO: this is a hack to get the path to work, fix Props type
      // if props are passed in after, they will override the path
      path={path} 
    />
  );
};
