import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo.png';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { z } from 'zod';
import useLogin from '../hooks/useLogin';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
});

const Login = () => {

    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuthStore();
    const { mutateAsync: loginMutation } = useLogin();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        setErrors({});
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            const fieldErrors: { email?: string; password?: string } = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as 'email' | 'password'] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        try {
            const response = await loginMutation({ email, password });
            login(response.user, response.token);
            navigate('/home');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
            setErrors({
                password: errorMessage
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 w-full max-w-md">
                <div className="flex justify-start mb-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                        <img src={Logo} alt="Logo" width={24} height={24} />
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-left text-gray-900 mb-8">
                    Sign in
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full border rounded-md p-2 focus:outline-none border-2 ${errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-[#009540]'
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full border rounded-md p-2 focus:outline-none border-2 ${errors.password
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-[#009540]'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    onClick={handleLogin}
                    className="bg-[#009540] w-full rounded-md text-white p-3 border border-[#377D3F] mt-8"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
