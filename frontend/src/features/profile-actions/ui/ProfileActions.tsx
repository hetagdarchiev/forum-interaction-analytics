'use client';

import {
  IoBookmarkSharp,
  IoChatboxSharp,
  IoNotificationsSharp,
  IoSettingsSharp,
} from 'react-icons/io5';
import Link from 'next/link';

import { NavigationItem } from '../model/types/navigation-item.types';

import { selectIsAuthenticated, useAuthStore } from '@/entities/session';
import { useAuthMeQuery } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { Button, ProfileAvatar } from '@/shared/ui';

const navigations = [
  {
    name: 'Notifications',
    Icon: IoNotificationsSharp,
    href: AppRouter.notification,
  },
  {
    name: 'Messages',
    Icon: IoChatboxSharp,
    href: AppRouter.faq,
  },
  {
    name: 'Favorites',
    Icon: IoBookmarkSharp,
    href: AppRouter.favorites,
  },

  {
    name: 'Settings',
    Icon: IoSettingsSharp,
    href: AppRouter.main,
  },
] satisfies NavigationItem[];

interface Props {
  className?: string;
}

export function ProfileActions({ className }: Props) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { data: user } = useAuthMeQuery({ enabled: isAuthenticated });

  return (
    <nav className={cn(className)}>
      <div className='flex justify-between gap-x-5 lg:hidden'>
        {navigations.map(({ name, Icon, href }) => (
          <Button
            key={name.toLowerCase()}
            href={href}
            aria-label={name}
            title={name}
            color='ghost'
            className='border-gray-9e/10 flex aspect-square items-center justify-center rounded-[10px] border p-2.5'
          >
            <Icon
              aria-label={name}
              width={30}
              height={30}
              title={name}
              className='min-h-7.5 min-w-7.5'
            />
          </Button>
        ))}
      </div>
      <div className='hidden gap-x-6 lg:flex'>
        {navigations
          .filter(({ name }) =>
            ['messages', 'notifications'].includes(name.toLowerCase()),
          )
          .map(({ name, Icon, href }) => (
            <Link
              key={name.toLowerCase()}
              href={href}
              aria-label={name}
              title={name}
            >
              <Icon
                aria-label={name}
                width={30}
                height={30}
                title={name}
                className='min-h-7.5 min-w-7.5'
              />
            </Link>
          ))}
        <Link
          className='flex items-center gap-x-2.5'
          href={AppRouter.profile.root}
        >
          <ProfileAvatar width={30} authorName={user ? user.name : 'Avatar'} />
          <p className='max-w-32 truncate'>{user ? user.name : 'Anonym'}</p>
        </Link>
      </div>
    </nav>
  );
}
