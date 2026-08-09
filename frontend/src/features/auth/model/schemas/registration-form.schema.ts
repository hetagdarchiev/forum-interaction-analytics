import * as z from 'zod';

export const registrationFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Введите имя' })
      .max(50, { message: 'Имя слишком длинное' }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, { message: 'Введите почту' })
      .email({ message: 'Неверный формат почты' }),
    password: z
      .string()
      .min(8, { message: 'Пароль должен быть не менее 8 символов' })
      .regex(/[a-z]/, {
        message: 'Пароль должен содержать хотя бы одну строчную букву',
      })
      .regex(/[0-9]/, {
        message: 'Пароль должен содержать хотя бы одну цифру',
      }),
    confirmPassword: z.string().min(1, { message: 'Подтвердите пароль' }),
    policy: z.boolean().refine((val) => val, {
      message: 'Условия должны быть приняты',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegistrationFormTypes = z.infer<typeof registrationFormSchema>;
