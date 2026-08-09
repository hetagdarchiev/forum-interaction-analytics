import React from 'react';
import Image from 'next/image';

import logoLetterImage from '@/shared/assets/images/logo-letter.png';
import { cn } from '@/shared/lib/classNames';

interface InfoCardProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, text, className }) => (
  <div
    className={`absolute z-10 flex max-w-75 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-2xl shadow-black/30 backdrop-blur-md ${className} `}
  >
    <div className='shrink-0 text-lg'>{icon}</div>
    <p className='leading-tight text-gray-300'>{text}</p>
  </div>
);

interface Props {
  className?: string;
}

export default function HeroSection({ className }: Props) {
  return (
    <div
      className={cn(
        'relative flex h-125 w-full max-w-4xl items-center justify-center',
        className,
      )}
    >
      {/* Центральная картинка */}
      <div className='relative z-0 flex h-auto w-auto items-center justify-center'>
        <Image
          src={logoLetterImage}
          alt='Comunicore — платформа для общения'
          className='h-full w-full object-contain drop-shadow-2xl'
          priority
        />
      </div>

      {/* Карточки с текстом вокруг */}
      <InfoCard
        icon={
          <span role='img' aria-label='wave'>
            👋
          </span>
        }
        text='Добро пожаловать в Comunicore'
        className='top-10 left-4'
      />

      <InfoCard
        icon={
          <span role='img' aria-label='people'>
            👥
          </span>
        }
        text='Находи единомышленников и общайся без границ'
        className='bottom-10 left-12 max-w-80'
      />

      <InfoCard
        icon={
          <span role='img' aria-label='zap'>
            ⚡
          </span>
        }
        text='Делись идеями и получай обратную связь'
        className='top-1/2 right-0 -translate-y-1/2'
      />
    </div>
  );
}
