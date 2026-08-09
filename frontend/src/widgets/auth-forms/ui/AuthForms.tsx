import Image from 'next/image';

import { altAuthButtons } from '../model/altAuthButtons';

import { RegistrationForm } from '@/features/auth';

import { Button } from '@/shared/ui';

export function AuthForms() {
  return (
    <div className='bg-dark-0e border-purple-86/40 flex w-full flex-col gap-y-7 rounded-[10px] border px-4 py-8 lg:px-12.5 lg:py-10'>
      <header className='mx-auto flex max-w-82 flex-col gap-y-2.5 text-center'>
        <h2 className='text-4xl font-bold'>Создать аккаунт</h2>
        <p>
          Добро пожаловать в <span className='text-purple-86'>Comunicore!</span>
          🎉 Заполните форму, чтобы начать.
        </p>
      </header>

      <RegistrationForm />

      <div className='flex items-center gap-3'>
        <div className='border-gray-9e/30 flex-1 border-t' />
        <span className='text-gray-9e text-sm'>или продолжите с</span>
        <div className='border-gray-9e/30 flex-1 border-t' />
      </div>

      {/* Альт способы войти */}
      <section className='flex flex-wrap items-center justify-center gap-3'>
        {altAuthButtons.map(({ iconUrl, label }) => (
          <Button
            key={label}
            color='ghost'
            className='flex items-center justify-center gap-2'
          >
            <Image src={iconUrl} alt={label} width={24} />
            {label}
          </Button>
        ))}
      </section>
    </div>
  );
}
