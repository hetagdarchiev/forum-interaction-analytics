import { LabelHTMLAttributes, PropsWithChildren } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '../lib/classNames';

type LablePropsAttrs = LabelHTMLAttributes<HTMLLabelElement> &
  PropsWithChildren;

interface LabelProps extends LablePropsAttrs {
  className?: string;
  isHidden?: boolean;
  error?: FieldError;
}

export function Label(props: LabelProps) {
  const { className, children, isHidden, error, htmlFor, ...attrs } = props;

  return (
    <label
      className={cn(
        'text-light cursor-pointer text-[16px] font-bold',
        isHidden && 'visually-hidden',
        error?.message && 'text-red-ff',
        className,
      )}
      htmlFor={htmlFor}
      {...attrs}
    >
      {children}
    </label>
  );
}
