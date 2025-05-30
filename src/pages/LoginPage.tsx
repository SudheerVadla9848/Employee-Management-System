import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, error: authError } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/employees/search';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoggingIn(true);
    setError(null);
    
    try {
      const success = await login({
        username: data.username,
        password: data.password,
      });
      
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Show any authentication errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Employee Management System
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Input
                id="username"
                type="text"
                label="Username"
                placeholder="Enter your username"
                autoComplete="username"
                error={errors.username?.message}
                {...register('username')}
              />
            </div>
            
            <div className="mb-4">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
          </div>
          
          {error && (
            <Alert variant="error" title="Login Error">
              {error}
            </Alert>
          )}
          
          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoggingIn}
              className="group relative flex"
            >
              Sign in
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Use demo credentials:</p>
            <p>Username: <span className="font-medium">admin</span> | Password: <span className="font-medium">admin123</span></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;