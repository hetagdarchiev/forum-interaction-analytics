import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '../lib/classNames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isError?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, isError, icon, ...rest } = props;

  const commonClassName = cn(
    'text-light placeholder:text-light border-gray-9e/10 min-h-10 rounded-[10px] border bg-transparent px-2.5 py-2.5 text-[16px] outline-none',
    isError && 'outline-red-ff',
    className,
  );

  if (icon) {
    return (
      <div
        className={cn(
          commonClassName,
          'flex gap-x-2.5',
          isError && 'border-red-ff',
          className,
        )}
      >
        <div className={cn('text-gray-9e shrink-0', isError && 'text-red-ff')}>
          {icon}
        </div>
        <input
          className={cn(
            'text-light placeholder:text-light flex-1 bg-transparent text-[16px] outline-none',
          )}
          ref={ref}
          id={rest.name}
          {...rest}
        />
      </div>
    );
  }

  return (
    <input
      className={cn(commonClassName, isError && 'border-red-ff', className)}
      ref={ref}
      id={rest.name}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
