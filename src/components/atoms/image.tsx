import { IKImage } from "imagekitio-react";
import type { IKImageProps } from "imagekitio-react/dist/types/components/IKImage/combinedProps";

type Props = IKImageProps & {
  url: string;
  path: string;
  alt: string;
  loading?: IKImageProps["loading"];
  className?: string;
}

export const ImageKitImg = ({ url, path, alt, loading, className }: Props) => {
  return (
    <IKImage
      urlEndpoint={url}
      path={path}
      alt={alt}
      loading={loading}
      className={className}
    />
  );
};
