import Image from 'next/image';

import { AuthForms } from '@/widgets/auth-forms';

import bookMarkIcon from '@/shared/assets/icons/book-mark-purple.svg';
import messageIcon from '@/shared/assets/icons/message-purple.svg';
import peopleIcon from '@/shared/assets/icons/people-purple.svg';
// import { AppRouter } from '@/shared/config/app-router';

const heroCards = [
  {
    iconUrl: messageIcon,
    title: 'Обсуждайте',
    subtitle:
      'Участвуйте в интересных дискуссиях и находите ответы на любые вопросы.',
  },
  {
    iconUrl: peopleIcon,
    title: 'Находите людей',
    subtitle: 'Комьюнити профессионалов и энтузиастов со всего мира.',
  },
  {
    iconUrl: bookMarkIcon,
    title: 'Делитесь знаниями',
    subtitle: 'Публикуйте полезные материалы и помогайте другим расти.',
  },
];

export default function Registration() {
  return (
    <div className='bg-dark-0e flex min-h-screen w-full flex-col-reverse lg:flex-row'>
      {/* Левая секция с фоном */}
      <section className="min-h-screen bg-[url('/auth-bg.webp')] bg-cover bg-center bg-no-repeat p-3 sm:p-6 lg:w-[40%] lg:p-10">
        {/* Контент поверх фона */}
        <div className='mt-10 flex max-w-120 flex-col gap-y-10 sm:mt-20 lg:mt-37.5'>
          <header className='flex flex-col gap-y-10'>
            <h1 className='text-4xl'>
              <b>
                comuni<span className='text-purple-67'>core</span>
              </b>{' '}
              - место для настоящего общения
            </h1>
            <p className='max-w-100'>
              Присоединяйтесь к сообществу, делитесь идеями, задавайте вопросы и
              находите единомышленников.
            </p>
          </header>

          <ul className='flex flex-col gap-y-2.5'>
            {heroCards.map(({ iconUrl, title, subtitle }, index) => (
              <li
                key={index}
                className='bg-dark-0e/70 border-purple-86 flex items-center gap-x-2.5 rounded-[10px] border p-2.5'
              >
                <div className='bg-pink-d5/10 flex size-17.5 shrink-0 items-center justify-center rounded-[10px]'>
                  <Image src={iconUrl} alt='Иконка' />
                </div>
                <div className='gap-y-.25 flex flex-col'>
                  <h2 className='text-[16px]] font-bold'>{title}</h2>
                  <p className='text-light/70 text-sm font-bold'>{subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Правая секция с формой авторизации */}
      <section className='flex items-center justify-center p-3 lg:w-[60%] lg:p-10'>
        <AuthForms />
      </section>
    </div>
  );
}
