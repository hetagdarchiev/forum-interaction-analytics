'use client';

import { RefObject } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '../../model/navLinks';

import { AuthButtons } from '@/features/auth-buttons';
import { ProfileActions } from '@/features/profile-actions';

import { selectIsAuthenticated, useAuthStore } from '@/entities/session';

import {
  useMenuActions,
  useMenuIsOpen,
} from '@/shared/hooks/useMenu.selectors';
import { cn } from '@/shared/lib/classNames';

interface BurgerMenuProps {
  menuRef: RefObject<HTMLElement | null>;
}

export function BurgerMenu({ menuRef }: BurgerMenuProps) {
  const isOpen = useMenuIsOpen();
  const setIsOpen = useMenuActions().setIsOpen;
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === href;

    return pathname.startsWith(href);
  };

  return (
    <aside
      id='aside-menu'
      inert={!isOpen}
      ref={menuRef}
      className={cn(
        'fixed top-0 right-0 bottom-0 z-40',
        'bg-dark-0e flex w-screen flex-col gap-y-2.5 py-16 duration-300 ease-in-out',
        !isOpen && 'translate-x-full',
        'sm:w-80',
        'lg:hidden',
      )}
    >
      <nav className='flex flex-col'>
        {navLinks.map(({ label, href, iconUrl }) => {
          const isActive = isLinkActive(href);

          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
              className={cn(
                'hover:text-purple-67 relative flex gap-x-5 px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-white/5',
                'before:bg-purple-67 before:absolute before:top-3 before:bottom-3 before:left-0 before:w-1 before:rounded-r-full before:opacity-0 before:transition-opacity before:content-[""]',
                isActive && 'bg-purple-67',
              )}
            >
              {iconUrl && (
                <Image src={iconUrl} alt={label} width={25} height={25} />
              )}
              {label}
            </Link>
          );
        })}
      </nav>
      <div className='px-8 py-4'>
        {isAuthenticated ? <ProfileActions /> : <AuthButtons />}
      </div>
    </aside>
  );
}
