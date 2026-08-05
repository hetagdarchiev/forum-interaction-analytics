import { HTMLAttributes } from 'react';

import { cn } from '../lib/classNames';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-10 w-10 border-4',
  md: 'h-20 w-20 border-8',
  lg: 'h-30 w-30 border-12',
};

export const Loader = ({
  size = 'md',
  fullScreen,
  className,
  ...attrs
}: LoaderProps) => {
  const loader = (
    <div
      className={cn(
        'border-purple-67 border-t-purple-9d animate-spin rounded-full',
        sizeClasses[size],
        className,
      )}
      {...attrs}
    />
  );

  if (fullScreen) {
    return (
      <div className='bg-dark-0e fixed inset-0 z-50 flex items-center justify-center'>
        {loader}
      </div>
    );
  }

  return loader;
};
