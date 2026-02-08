import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { googleLogin } from '../redux/slices/authSlice';

export default function GoogleAuthButton({ text = 'Continue with Google' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <div className="divider text-sm text-base-content/60">
        or
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(res) => {
            dispatch(googleLogin(res.credential))
              .unwrap()
              .then(() => navigate('/'));
          }}
          onError={() => {
            console.log('Google login failed');
          }}
          text="continue_with"
          shape="pill"
          theme="outline"
        />
      </div>
    </div>
  );
}
