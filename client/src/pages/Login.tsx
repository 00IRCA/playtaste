import { BASE_URL } from '../lib/api';

export default function Login() {
  return (
    <div>
      <a href={`${BASE_URL}/api/auth/google`}>Sign in with Google</a>
    </div>
  );
}
