import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '../lib/classNames';

type InputColor = 'transparent' | 'bordered' | 'ghost';

type InputSize = 'sm' | 'md' | 'lg';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isError?: string;
  inputSize?: InputSize;
  color?: InputColor;
}

const colorStyles: Record<InputColor, string> = {
  transparent: '',
  ghost:
    'bg-dark-1b border border-gray-9e/10 bg-transparent outline-none text-gray-9e placeholder:text-gray-9e',
  bordered:
    'bg-dark-1b border border-gray-9e/10 bg-dark-1b  outline-none text-gray-9e placeholder:text-gray-9e',
};
const sizeStyles: Record<InputSize, string> = {
  sm: '',
  md: 'px-4 py-2.5 rounded-[10px]',
  lg: 'px-5 py-2.5 text-lg rounded-[10px] leading-1',
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    isError,
    inputSize = 'md',
    color = 'bordered',
    ...rest
  } = props;

  const commonClassName = cn(
    colorStyles[color],
    sizeStyles[inputSize],
    className,
  );

  return (
    <input
      className={cn(commonClassName, isError && 'outline-red-ff', className)}
      ref={ref}
      id={rest.name}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
