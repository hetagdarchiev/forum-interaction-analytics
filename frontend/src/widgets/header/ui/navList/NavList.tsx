import Image from 'next/image';
import Link from 'next/link';

import faqIcon from '@/shared/assets/icons/faq-icon.svg';
import favoritesIcon from '@/shared/assets/icons/favorites-icon.svg';
import notificationsIcon from '@/shared/assets/icons/notifications-icon.svg';
import profileIcon from '@/shared/assets/icons/profile-icon.svg';

const navigations = [
  {
    name: 'Notifications',
    icon: notificationsIcon,
    href: '/notifications',
  },
  {
    name: 'Profile',
    icon: profileIcon,
    href: '/profile',
  },
  {
    name: 'FAQ',
    icon: faqIcon,
    href: '/rules',
  },
  {
    name: 'Favorites',
    icon: favoritesIcon,
    href: '/favorites',
  },
];

export function NavList() {
  return (
    <nav>
      <ul className='flex items-center gap-x-5'>
        {navigations.map((item) => (
          <li key={item.name.toLowerCase()}>
            <Link href={item.href} aria-label={item.name} title={item.name}>
              <Image
                src={item.icon}
                alt={item.name}
                width={24}
                height={24}
                className='min-w-5'
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
