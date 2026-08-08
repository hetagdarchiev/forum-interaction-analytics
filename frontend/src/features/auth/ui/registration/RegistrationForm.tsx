'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { LuCircleUser, LuLockKeyhole, LuMail } from 'react-icons/lu';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRegistration } from '../../model/hooks/useRegistration';
import {
  registrationFormSchema,
  RegistrationFormTypes,
} from '../../model/schemas/registration-form.schema';

import githubIcon from '@/shared/assets/icons/github.svg';
import googleIcon from '@/shared/assets/icons/google.svg';
import telegramIcon from '@/shared/assets/icons/telegram.svg';
import vkIcon from '@/shared/assets/icons/vk.svg';
import { AppRouter } from '@/shared/config/app-router';
import { getErrorMessage } from '@/shared/lib/helpers/getErrorMessage';
import { Button, Checkbox, ErrorMessage, FormField, Label } from '@/shared/ui';

const defaultValues = {
  name: '',
  email: '',
  password: '',
  policy: false,
};

const altAuthButtons = [
  {
    label: 'Github',
    iconUrl: githubIcon,
  },
  {
    label: 'Google',
    iconUrl: googleIcon,
  },
  {
    label: 'Telegram',
    iconUrl: telegramIcon,
  },
  {
    label: 'VK ID',
    iconUrl: vkIcon,
  },
];

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormTypes>({
    resolver: zodResolver(registrationFormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const { mutate: registrationMutate, error, isPending } = useRegistration();

  const onSubmit: SubmitHandler<RegistrationFormTypes> = (data) => {
    registrationMutate(
      { body: data },
      {
        onSuccess: () => {
          reset(defaultValues);
        },
      },
    );
  };

  return (
    <form
      className='bg-dark-0e border-purple-86/40 flex w-full flex-col gap-y-7 rounded-[10px] border px-4 py-8 lg:px-12.5 lg:py-10'
      onSubmit={handleSubmit(onSubmit)}
    >
      <section className='mx-auto flex max-w-82 flex-col gap-y-2.5 text-center'>
        <h2 className='text-4xl font-bold'>Создать аккаунт</h2>
        <p>
          Добро пожаловать в <span className='text-purple-86'>Comunicore!</span>
          🎉 Заполните форму, чтобы начать.
        </p>
      </section>

      <section className='flex flex-col gap-y-5'>
        <FormField
          id='user-name'
          label='Имя пользователя'
          placeholder='Введите имя пользователя'
          helperText='От 3 до 40 символов. Только буквы, цифры и подчёркивания'
          icon={<LuCircleUser size={20} />}
          {...register('name')}
          error={errors.name}
        />
        <FormField
          id='user-email'
          label='Email'
          type='email'
          placeholder='Введите ваш email'
          icon={<LuMail size={20} />}
          {...register('email')}
          error={errors.email}
        />
        <FormField
          id='user-password'
          label='Пароль'
          placeholder='Введите ваш пароль'
          helperText='Минимум 8 символов, большие буквы и цифры'
          icon={<LuLockKeyhole size={20} />}
          {...register('password')}
          error={errors.password}
        />
        <FormField
          id='user-password-again'
          label='Повторите пароль'
          placeholder='Повторите ваш пароль'
          icon={<LuLockKeyhole size={20} />}
        />
        <FormField
          id='user-date'
          label='Дата рождения (необязательно)'
          placeholder='ДД.ММ.ГГГГ'
        />
      </section>

      <section>
        <Label
          htmlFor='use-condition-agreement'
          className='flex items-center gap-x-2.5'
        >
          <Checkbox
            id='use-condition-agreement'
            size={24}
            {...register('policy')}
          />
          <p className='text-[12px] font-normal'>
            Я принимаю{' '}
            <Link href={AppRouter.policy.privacy} className='text-purple-86'>
              Пользовательское соглашение
            </Link>
            <br />и{' '}
            <Link
              href={AppRouter.policy.userAgreement}
              className='text-purple-86'
            >
              Политику конфиденциальности
            </Link>
          </p>
        </Label>
        {errors.policy?.message && (
          <ErrorMessage error={errors.policy.message} />
        )}
      </section>

      {error && <ErrorMessage error={getErrorMessage(error)} />}

      <Button type='submit' disabled={isPending} className='w-full'>
        {isPending ? 'Загрузка...' : 'Зарегистрироваться'}
      </Button>

      {/* Divider */}
      <div className='flex items-center gap-3'>
        <div className='border-gray-9e/30 flex-1 border-t' />
        <span className='text-gray-9e text-sm'>или продолжите с</span>
        <div className='border-gray-9e/30 flex-1 border-t' />
      </div>

      {/* Social Auth Buttons */}
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
    </form>
  );
}
