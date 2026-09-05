'use client';

import { AuthMeResponse } from '../types/authMe.types';
import { User } from '../types/user.types';

import { useAuthMeQuery } from './useAuthMeQuery';

export const useUser = (options?: { enabled?: boolean }) => {
  const { data, ...query } = useAuthMeQuery(options);

  const user = data
    ? 'user' in data
      ? (data as unknown as AuthMeResponse)
      : ({
          accessToken: '',
          user: data as unknown as User,
        } satisfies AuthMeResponse)
    : null;

  return {
    user,
    ...query,
  };
};
