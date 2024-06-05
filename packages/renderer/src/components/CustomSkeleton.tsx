import {ReactNode, useEffect, useState} from 'react';
import Skeleton, {SkeletonStyleProps} from 'react-loading-skeleton';

interface IProps {
  children: ReactNode;
  altProps: SkeletonStyleProps;
  show: boolean;
  deelay?: number;
}

export default function CustomSkeleton({children, altProps, show, deelay}: IProps) {
  const [deelayedShow, setDeelayedShow] = useState(false);
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setDeelayedShow(show);
      }, deelay || 500);
    }
  }, [show]);

  return deelayedShow ? (
    <span className="animate__animated animate__fadeIn">{children}</span>
  ) : (
    <Skeleton
      {...altProps}
      className="animate__animated animate__fadeIn"
    />
  );
}
