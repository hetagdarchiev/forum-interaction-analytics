import { ComponentPropsWithoutRef } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import Link from 'next/link';

import { cn } from '../lib/classNames';

type ViewAllLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  label: string;
};

export function ViewAllLink({
  className,
  label,
  children,
  ...props
}: ViewAllLinkProps) {
  return (
    <Link
      className={cn(
        'text-purple-67 hover:text-purple-86 flex items-center gap-2 text-base font-bold transition-colors',
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      {children ?? <BsArrowRight size={18} aria-hidden='true' />}
    </Link>
  );
}
