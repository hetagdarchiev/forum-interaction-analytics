import { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import Link from 'next/link';

type Props = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    className?: string;
  }
>;

export function Button(props: Props) {
  const { children, href, className = '', ...attributes } = props;
  return (
    <Link
      href={href}
      {...attributes}
      className={`bg-blue-16 rounded-md px-5 py-3 ${className}`}
    >
      {children}
    </Link>
  );
}
