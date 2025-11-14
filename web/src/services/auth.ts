const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type LoginRequest = {
  email: string;
  password: string;
}

type User = {
  id: number;
  email: string;
}

type AuthResponse = {
  message: string;
  token: string;
  user: User;
}

const authFetch = async (endpoint: string, credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${SERVER_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

export const loginApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
  return authFetch('/api/auth/login', credentials);
};

export const registerApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
  return authFetch('/api/auth/register', credentials);
};