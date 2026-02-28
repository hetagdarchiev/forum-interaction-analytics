import Image from 'next/image';
import Link from 'next/link';

import favoritesIcon from '@/shared/assets/icons/favorites-icon.svg';
import galleryIcon from '@/shared/assets/icons/gallery-icon.svg';
import profileIcon from '@/shared/assets/icons/profile-icon.svg';
import questionsIcon from '@/shared/assets/icons/questions-icon.svg';

const navigations = [
  {
    name: 'Gallery',
    icon: galleryIcon,
    href: 'gallery',
  },
  {
    name: 'Profile',
    icon: profileIcon,
    href: 'profile',
  },
  {
    name: 'Questions',
    icon: questionsIcon,
    href: 'questions',
  },
  {
    name: 'Favorites',
    icon: favoritesIcon,
    href: 'favorites',
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
