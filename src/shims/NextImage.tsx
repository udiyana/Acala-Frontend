import type { CSSProperties, ImgHTMLAttributes } from 'react';

type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    preload?: boolean;
};

export default function Image({
    src,
    alt,
    fill = false,
    priority = false,
    preload = false,
    loading,
    style,
    width,
    height,
    ...props
}: NextImageProps) {
    const fillStyle: CSSProperties | undefined = fill
        ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              ...style,
          }
        : style;

    return (
        <img
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            loading={priority || preload ? 'eager' : loading ?? 'lazy'}
            decoding={priority || preload ? 'sync' : 'async'}
            style={fillStyle}
            {...props}
        />
    );
}
