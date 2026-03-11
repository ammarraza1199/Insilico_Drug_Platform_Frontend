import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../api/client';
import { cn } from '../utils/formatters';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, setError, error, isLoading, setLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', data);
      const { token, user } = response.data;
      setSession(token, user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Sign in to PreciousGPT</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your credentials to access your research dashboard</p>
        </div>

        {error && (
          <div className="rounded-md bg-scientific-red/10 p-3 text-sm text-scientific-red">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                {...register('email')}
                type="email"
                className={cn(
                  "mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1",
                  errors.email ? "border-scientific-red ring-scientific-red" : "border-slate-300 focus:border-scientific-blue focus:ring-scientific-blue"
                )}
                placeholder="researcher@university.edu"
              />
              {errors.email && <p className="mt-1 text-xs text-scientific-red">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1",
                    errors.password ? "border-scientific-red ring-scientific-red" : "border-slate-300 focus:border-scientific-blue focus:ring-scientific-blue"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-scientific-red">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-scientific-blue focus:ring-scientific-blue" />
              <label className="ml-2 block text-sm text-slate-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-scientific-blue hover:text-blue-500">Forgot password?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-scientific-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-scientific-blue focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600">Don't have an account? </span>
          <Link to="/register" className="font-medium text-scientific-blue hover:text-blue-500">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
