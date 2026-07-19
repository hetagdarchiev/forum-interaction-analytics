import {
  FaBalanceScale,
  FaBullhorn,
  FaFeather,
  FaHome,
  FaUsers,
} from 'react-icons/fa';

import { AppRouter } from '@/shared/config/app-router';

export const navLinks = [
  { label: 'Главная', href: AppRouter.main, Icon: FaHome },
  { label: 'Форум', href: AppRouter.threads, Icon: FaBullhorn },
  { label: 'Участники', href: AppRouter.notification, Icon: FaUsers },
  { label: 'Блог', href: AppRouter.support, Icon: FaFeather },
  { label: 'Правила', href: AppRouter.award, Icon: FaBalanceScale },
];
