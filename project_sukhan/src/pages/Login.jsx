import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { loginUser } from '../redux/slices/authSlice';
import GoogleAuthButton from '../components/GoogleAuthButton';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(s => s.auth);

  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) });

  const submit = async (data) => {
    const res = await dispatch(loginUser(data)).unwrap();
    if (res) navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-serif text-primary">
            📖 Sukhan
          </Link>
          <h1 className="text-3xl font-semibold text-base-content mt-4">
            Welcome back
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="bg-base-100/90 backdrop-blur rounded-2xl shadow-xl p-6 space-y-4"
        >

          {error && (
            <div className="bg-error/10 text-error text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <input
            placeholder="Email"
            {...register('email')}
            className="input input-bordered w-full"
          />
          {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}

          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className="input input-bordered w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-sm text-base-content/60"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}

          <button
            disabled={isLoading}
            className="btn btn-primary w-full mt-4"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center text-sm text-base-content/60 mt-3">
            New here?{' '}
            <Link to="/register" className="text-primary underline">
              Create account
            </Link>
          </div>
          <GoogleAuthButton text='Continue with Google' />
        </form>
      </div>
    </div>
  );
}
