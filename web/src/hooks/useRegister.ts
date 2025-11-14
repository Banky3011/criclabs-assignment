import { useMutation } from '@tanstack/react-query';
import type { AuthCredentials, AuthResponse } from '../types/auth';

const useRegister = () => {
  return useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async ({ email, password }) => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    },
  });
};

export default useRegister;
