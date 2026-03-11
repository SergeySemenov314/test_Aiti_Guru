import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="12" width="4" height="8" rx="2" fill="#1e1e1e" />
      <rect x="9" y="6" width="4" height="20" rx="2" fill="#1e1e1e" />
      <rect x="16" y="9" width="4" height="14" rx="2" fill="#1e1e1e" />
      <rect x="23" y="4" width="4" height="24" rx="2" fill="#1e1e1e" />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '', rememberMe: false },
  });

  const usernameValue = watch('username');

  const onSubmit = async (data: LoginFormValues) => {
    setApiError('');
    try {
      await login(data.username, data.password, data.rememberMe);
      navigate('/products');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setApiError(message || 'Ошибка авторизации. Попробуйте снова.');
      } else {
        setApiError('Произошла непредвиденная ошибка.');
      }
    }
  };

  const usernameRegister = register('username', {
    required: 'Введите логин',
  });

  const passwordRegister = register('password', {
    required: 'Введите пароль',
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-3">
          <WaveIcon />
          <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать!</h1>
          <p className="text-sm text-gray-400">Пожалуйста, авторизуйтесь</p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Логин"
            placeholder="Введите логин"
            leftIcon={<UserIcon />}
            error={errors.username?.message}
            {...usernameRegister}
            value={usernameValue}
            onClear={() => setValue('username', '', { shouldValidate: true })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Пароль</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 pointer-events-none">
                <LockIcon />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                {...passwordRegister}
                className={`w-full rounded-lg border bg-white
                           pl-10 pr-10 py-2.5 text-sm text-gray-900
                           placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                           transition-colors duration-150
                           ${errors.password ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Checkbox
            label="Запомнить данные"
            {...register('rememberMe')}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>

          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="h-px flex-1 bg-gray-200" />
            <span>или</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Нет аккаунта?{' '}
            <a href="#" className="font-medium text-primary hover:text-primary-hover">
              Создать
            </a>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Тестовый логин: <span className="font-medium text-gray-500">emilys</span> / <span className="font-medium text-gray-500">emilyspass</span>
        </p>
      </div>
    </div>
  );
}
