import {
  cloneElement,
  forwardRef,
  InputHTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';

import { cn } from '../lib/classNames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  icon?: ReactNode;
  actionIcon?: ReactNode;
  onActionIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, icon, actionIcon, onActionIconClick, ...rest } = props;

  const renderIcon = (icon: ReactNode) => {
    if (isValidElement(icon)) {
      return cloneElement(icon as ReactElement<{ size?: number }>, {
        size: 20, // Стандартный размер по умолчанию
        ...(icon.props as object),
      });
    }
    return icon;
  };

  return (
    <div
      className={cn(
        'text-light placeholder:text-light border-gray-9e/10 flex min-h-10 gap-x-2.5 rounded-[10px] border bg-transparent px-2.5 py-2.5 text-[16px]',
        className,
      )}
    >
      {icon && <div className='text-gray-9e shrink-0'>{renderIcon(icon)}</div>}
      <input
        className={cn(
          'text-light placeholder:text-light w-full min-w-0 flex-1 bg-transparent text-[16px] outline-none',
        )}
        ref={ref}
        id={rest.name}
        {...rest}
      />
      {actionIcon && (
        <button
          type='button'
          onClick={onActionIconClick}
          className='text-gray-9e hover:text-light ml-2.5 shrink-0 cursor-pointer transition-colors focus:outline-none'
        >
          {renderIcon(actionIcon)}
        </button>
      )}
    </div>
  );
});

Input.displayName = 'Input';
