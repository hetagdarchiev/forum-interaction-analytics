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
import { useMenuActions } from '@/shared/hooks/useMenu.selectors';
import { cn } from '@/shared/lib/classNames';
import { Button, ProfileAvatar } from '@/shared/ui';

const navigations = [
  {
    name: 'Notifications',
    Icon: IoNotificationsSharp,
    href: AppRouter.profile,
  },
  {
    name: 'Messages',
    Icon: IoChatboxSharp,
    href: AppRouter.profile,
  },
  {
    name: 'Favorites',
    Icon: IoBookmarkSharp,
    href: AppRouter.profile,
  },

  {
    name: 'Settings',
    Icon: IoSettingsSharp,
    href: AppRouter.profile,
  },
] satisfies NavigationItem[];

interface Props {
  className?: string;
}

export function ProfileActions({ className }: Props) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { data: user } = useAuthMeQuery({ enabled: isAuthenticated });
  const setIsOpen = useMenuActions().setIsOpen;

  return (
    <nav className={cn(className)}>
      {/* Вид на мобилках */}
      <div className='flex justify-between gap-x-5 lg:hidden'>
        {navigations.map(({ name, Icon, href }) => (
          <Button
            key={name.toLowerCase()}
            href={href}
            aria-label={name}
            title={name}
            color='ghost'
            onClick={() => setIsOpen(false)}
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
      {/* Вид на компах */}
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
          </li>
        ))}
        <li className='size-6.25'>
          <Link href={AppRouter.profile.root} title={user ? user.name : 'user'}>
            <ProfileAvatar
              width={25}
              height={25}
              unoptimized
              authorName={user ? user.name : 'user'}
              avatarUrl={user?.avatarUrl}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
