import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - Productivity Management',
  description: 'Sign in to your productivity management account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your productivity dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}