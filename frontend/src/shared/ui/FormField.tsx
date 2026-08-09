import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '../lib/classNames';

import { ErrorMessage } from './ErrorMessage';
import { Input } from './Input';
import { Label } from './Label';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: FieldError;
  icon?: ReactNode;
  helperText?: ReactNode;
  className?: 'string';
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, error, icon, helperText, id, ...inputProps }, ref) => (
    <div className={cn('flex flex-col gap-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        ref={ref}
        id={id}
        icon={icon}
        isError={error?.message}
        {...inputProps}
      />
      {helperText && !error && (
        <p className='text-gray-9e text-sm'>{helperText}</p>
      )}
      {error?.message && <ErrorMessage error={error.message} />}
    </div>
  ),
);

FormField.displayName = 'FormField';
