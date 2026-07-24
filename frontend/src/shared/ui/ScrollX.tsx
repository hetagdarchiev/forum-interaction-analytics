import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  type WheelEvent,
} from 'react';

import { cn } from '../lib/classNames';

type ScrollXProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  wheelMultiplier?: number;
};

export const ScrollX = forwardRef<HTMLDivElement, ScrollXProps>(
  function ScrollX(props, ref) {
    const {
      children,
      className,
      onWheel,
      wheelMultiplier = 1,
      ...restProps
    } = props;

    const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        event.currentTarget.scrollLeft += event.deltaY * wheelMultiplier;
      }

      onWheel?.(event);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'scrollbar-none overflow-x-auto overflow-y-hidden scroll-smooth',
          className,
        )}
        onWheel={handleWheel}
        {...restProps}
      >
        {children}
      </div>
    );
  },
);
