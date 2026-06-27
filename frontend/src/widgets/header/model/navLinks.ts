import homeIcon from '@/shared/assets/icons/home.svg';
import megaphoneIcon from '@/shared/assets/icons/megaphone.svg';
import quillPenIcon from '@/shared/assets/icons/quill-pen.svg';
import scalesIcon from '@/shared/assets/icons/scales.svg';
import usersIcon from '@/shared/assets/icons/users.svg';
import { AppRouter } from '@/shared/config/app-router';

export const navLinks = [
  { label: 'Главная', href: AppRouter.main, iconUrl: homeIcon },
  { label: 'Форум', href: AppRouter.threads, iconUrl: megaphoneIcon },
  { label: 'Участники', href: AppRouter.notification, iconUrl: usersIcon },
  { label: 'Блог', href: AppRouter.support, iconUrl: quillPenIcon },
  { label: 'Правила', href: AppRouter.award, iconUrl: scalesIcon },
];
