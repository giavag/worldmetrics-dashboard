import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { authService } from '../services/authService';

// 1. Define the Zod Schema for Validation
const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Invalid email format." }),
    password: z
        .string()
        .min(1, { message: "Password is required." })
});

// 2. Automatically extract the TypeScript type from the schema
type LoginData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);

    // 3. Initialize React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur", // Validation triggers when the user leaves the field
    });

    // 4. The handler that runs ONLY if the data is valid
    const onSubmit = async (data: LoginData) => {
        try {
            setLoginError(null);
            await authService.login(data);
            console.log("Login successful! Token saved in localStorage.");
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            setLoginError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-wm-bg">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-slate-200">
                <h1 className="text-3xl font-bold text-wm-dark text-center mb-2 tracking-wide">WorldMetrics</h1>
                <h2 className="text-lg text-slate-500 text-center mb-8">Sign in to your dashboard</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-1 transition-colors ${
                                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-wm-primary focus:ring-wm-primary'
                            }`}
                            {...register("email")}
                        />
                        {/* Conditional rendering for the error message */}
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className={`w-full border rounded px-4 py-3 focus:outline-none focus:ring-1 transition-colors ${
                                errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-wm-primary focus:ring-wm-primary'
                            }`}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    {loginError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                            {loginError}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-wm-primary hover:bg-wm-secondary text-white font-semibold py-3 px-4 rounded transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                    <div className="mt-6 text-center text-sm">
                        <span className="text-slate-500">Don't have an account? </span>
                        <Link to="/register" className="font-medium text-wm-primary hover:text-wm-secondary">
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;