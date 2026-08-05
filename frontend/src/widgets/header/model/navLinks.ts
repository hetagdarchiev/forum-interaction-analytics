import {
  FaBalanceScale,
  FaBullhorn,
  FaFeather,
  FaHome,
  FaUsers,
} from 'react-icons/fa';

import { AppRouter } from '@/shared/config/app-router';

export const navLinks = [
<<<<<<< HEAD
  { label: 'Форум', href: AppRouter.threads },
  { label: 'Участники', href: AppRouter.main },
  { label: 'Блог', href: AppRouter.main },
  { label: 'Правила', href: AppRouter.rules.root },
=======
  { label: 'Главная', href: AppRouter.main, Icon: FaHome },
  { label: 'Форум', href: AppRouter.threads, Icon: FaBullhorn },
  { label: 'Участники', href: AppRouter.participants, Icon: FaUsers },
  { label: 'Блог', href: AppRouter.blog.root, Icon: FaFeather },
  { label: 'Правила', href: AppRouter.rules.root, Icon: FaBalanceScale },
>>>>>>> main
];
