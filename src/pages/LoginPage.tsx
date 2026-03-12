import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import logoImg from '../assets/logo.png';

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

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: import.meta.env.VITE_TEST_USERNAME ?? '',
      password: import.meta.env.VITE_TEST_PASSWORD ?? '',
      rememberMe: localStorage.getItem('rememberMe') === 'true',
    },
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
        if (message === 'Invalid credentials') {
          setApiError('Неверный логин и/или пароль');
        } else {
          setApiError(message || 'Ошибка авторизации. Попробуйте снова.');
        }
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
      <div className="w-full max-w-[527px] rounded-3xl bg-white pt-12 px-[58px] pb-[54px] shadow-[0_4px_32px_0_rgba(0,0,0,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-[52px] h-[52px]" />
          <h1 className="text-[40px] font-semibold leading-[110%] tracking-[-0.015em] text-gray-900">Добро пожаловать!</h1>
          <p className="text-[18px] font-medium leading-[150%] tracking-[0%] text-gray-400">Пожалуйста, авторизуйтесь</p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Логин"
            labelClassName="!text-[18px] !font-medium !leading-[150%] !tracking-[-0.015em] !text-[#232323]"
            placeholder="Введите логин"
            leftIcon={<UserIcon />}
            error={errors.username?.message}
            {...usernameRegister}
            value={usernameValue}
            onClear={() => setValue('username', '', { shouldValidate: true })}
            className="!text-[18px] !font-medium !leading-[150%] !tracking-[-0.015em] !text-[#232323] placeholder:!text-gray-400"
          />
          <Input
            label="Пароль"
            labelClassName="!text-[18px] !font-medium !leading-[150%] !tracking-[-0.015em] !text-[#232323]"
            type="password"
            placeholder="Введите пароль"
            leftIcon={<LockIcon />}
            error={errors.password?.message}
            passwordToggle
            {...passwordRegister}
            className="!text-[18px] !font-medium !leading-[150%] !tracking-[-0.015em] !text-[#232323] placeholder:!text-gray-400"
          />

          <Checkbox
            label="Запомнить данные"
            {...register('rememberMe')}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>

          <div className="flex items-center gap-3 text-[16px] font-medium leading-[150%] tracking-normal text-gray-400">
            <div className="h-px flex-1 bg-gray-200" />
            <span>или</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-[18px] font-normal leading-[150%] tracking-normal text-[#666666]">
            Нет аккаунта?{' '}
            <a href="#" className="font-semibold text-[#242EDB] border-b border-[#242EDB] hover:opacity-80">
              Создать
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
