import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <div className="bg-[#F5F5F5] min-h-screen flex items-center justify-center p-8">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 w-full max-w-md">
                    {/* Icon */}
                    <div className="flex justify-start mb-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img
                                src={Logo}
                                alt="Logo"
                                width={24}
                                height={24}
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-left text-gray-900 mb-8">
                        Sign in
                    </h2>

                    <div className="">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md p-2 focus:border-[#009540] focus:outline-none border-2 mb-4"
                            placeholder=""
                        />

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md p-2 focus:border-[#009540] focus:outline-none border-2"
                                placeholder=""
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <button className="bg-[#009540] w-full rounded-md text-white p-3 border border-black mt-8">
                            Login
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;