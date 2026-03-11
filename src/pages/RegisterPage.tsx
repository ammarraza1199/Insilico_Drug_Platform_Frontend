import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../api/client';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['researcher', 'analyst', 'clinician', 'manager', 'engineer', 'admin']),
  organization: z.string().min(2, 'Organization is required'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSession, setError, error, isLoading, setLoading } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'researcher' }
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', data);
      const { token, user } = response.data;
      setSession(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-8 shadow-lg border">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Create Researcher Account</h2>
          <p className="mt-2 text-sm text-slate-600">Join the PreciousGPT network for in-silico biological simulation</p>
        </div>

        {error && (
          <div className="rounded-md bg-scientific-red/10 p-3 text-sm text-scientific-red">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input {...register('name')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="John Doe" />
              {errors.name && <p className="mt-1 text-xs text-scientific-red">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input {...register('email')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="john@university.edu" />
              {errors.email && <p className="mt-1 text-xs text-scientific-red">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Organization</label>
              <input {...register('organization')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Global AI Lab" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Primary Role</label>
              <select {...register('role')} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="researcher">Research Scientist</option>
                <option value="analyst">Data Analyst</option>
                <option value="clinician">Clinician</option>
                <option value="engineer">Bio-Engineer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input {...register('password')} type="password" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-xs text-scientific-red">{errors.password.message}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-scientific-blue px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-600 disabled:bg-blue-300 transition-all"
            >
              {isLoading ? "Creating Account..." : "Register Account"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600">Already have an account? </span>
          <Link to="/login" className="font-bold text-scientific-blue hover:text-blue-500">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
