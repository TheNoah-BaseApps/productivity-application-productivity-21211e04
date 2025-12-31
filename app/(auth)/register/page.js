import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Productivity Management',
  description: 'Create your productivity management account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our productivity management platform</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}