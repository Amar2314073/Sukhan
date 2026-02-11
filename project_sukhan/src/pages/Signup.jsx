import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { registerUser } from '../redux/slices/authSlice';
import { TfiEye } from 'react-icons/tfi';
import { FiEyeOff } from 'react-icons/fi'
import GoogleAuthButton from '../components/GoogleAuthButton';
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(6, 'Min 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Use upper, lower & number'),
  confirmPassword: z.string()
}).refine(d => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match'
});

export default function Signup() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector(s => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const submit = async ({ confirmPassword, ...data }) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Signup failed')
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] px-4">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <NavLink to="/" className="text-2xl font-serif text-primary">
            📖 Sukhan
          </NavLink>
          <h1 className="text-3xl font-semibold text-base-content mt-4">
            Create account
          </h1>
          <p className="text-base-content/60 mt-2 text-sm">
            Already a member?{' '}
            <NavLink to="/login" className="text-primary underline">
              Sign in
            </NavLink>
          </p>
        </div>

        {/* CARD */}
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
            placeholder="Full name"
            {...register('name')}
            className="input input-bordered w-full"
          />
          {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}

          <input
            placeholder="Email address"
            {...register('email')}
            className="input input-bordered w-full"
          />
          {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className="input input-bordered w-full pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              title={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                        z-10 text-base-content/60 hover:text-base-content"
            >
              {showPassword ? <FiEyeOff size={16} /> : <TfiEye size={16} />}
            </button>

          </div>

          {errors.password && (
            <p className="text-error text-xs">{errors.password.message}</p>
          )}

          
          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              {...register('confirmPassword')}
              className="input input-bordered w-full pr-12"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                        z-10 text-base-content/60 hover:text-base-content"
            >
              {showConfirmPassword ? <FiEyeOff size={16} /> : <TfiEye size={16} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-error text-xs">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <GoogleAuthButton text='Sign up with Google' />
        </form>
      </div>
    </div>
  );
}
