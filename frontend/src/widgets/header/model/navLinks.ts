import { AppRouter } from '@/shared/config/app-router';

export const navLinks = [
  { label: 'Форум', href: AppRouter.threads.root },
  { label: 'Участники', href: AppRouter.main },
  { label: 'Блог', href: AppRouter.main },
  { label: 'Правила', href: AppRouter.main },
];
