'use client';

import { ReactNode, useRef } from 'react';

import { Footer } from '@/widgets/footer';
import { BurgerMenu, Header } from '@/widgets/header';

import { selectStatus, useAuthStore } from '@/entities/session';
import { useUser } from '@/entities/user';

import { Loader } from '@/shared/ui';

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const menuRef = useRef<HTMLElement | null>(null);

  const burgerRef = useRef<HTMLButtonElement | null>(null);

  const status = useAuthStore(selectStatus);
  const isAuthenticated = status === 'authenticated';
  const {
    error: userError,
    isLoading: isUserLoading,
    user,
  } = useUser({
    enabled: isAuthenticated,
  });
  const shouldWaitForUser =
    isAuthenticated && !userError && (isUserLoading || !user?.user);

  if (status === 'loading' || shouldWaitForUser) {
    return <Loader size='lg' fullScreen />;
  }

  return (
    <>
      <Header menuRef={menuRef} burgerRef={burgerRef} />
      <BurgerMenu menuRef={menuRef} />
      <main className='flex-1'>{children}</main>
      <Footer />
    </>
  );
}
