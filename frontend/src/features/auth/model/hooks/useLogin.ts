'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoginFormTypes } from '../schemas/login-form.schema';

import { useAuthStore } from '@/entities/session';

import {
  authLoginMutation,
  userMeOptions,
} from '@/shared/api/generated/@tanstack/react-query.gen';
import { AppRouter } from '@/shared/config/app-router';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const setStatus = useAuthStore((state) => state.actions.setStatus);

  const loginMutation = useMutation({
    ...authLoginMutation().mutationKey,
    mutationFn: async (loginData: { body: LoginFormTypes }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData.body),
      });

      const contentType = response.headers.get('content-type') ?? '';
      const responseData = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          typeof responseData === 'string'
            ? responseData
            : responseData?.message ||
              responseData?.error ||
              'Не удалось войти';

        throw new Error(errorMessage);
      }

      return responseData;
    },
    onMutate: () => {
      setStatus('loading');
    },
    onSuccess: async () => {
      setStatus('authenticated');

      await queryClient.invalidateQueries({
        queryKey: userMeOptions().queryKey,
      });
      router.push(`${AppRouter.profile.root}`);
    },
    onError: () => {
      setStatus('anonymous');
    },
  });

  return loginMutation;
};
