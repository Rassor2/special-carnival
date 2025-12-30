import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Leaf, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await authAPI.register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
      } else {
        res = await authAPI.login(formData.email, formData.password);
        toast.success('Welcome back!');
      }

      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="w-10 h-10 text-[#7C9A92]" />
          <span className="font-['Playfair_Display'] text-2xl font-semibold text-[#2D3748]">
            RestfulMind
          </span>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-8">
          <div className="text-center mb-8">
            <h1 className="font-['Playfair_Display'] text-2xl font-semibold text-[#2D3748] mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-[#718096] text-sm">
              {isRegister
                ? 'Create an admin account to manage content'
                : 'Sign in to access the admin panel'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#2D3748] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-default w-full"
                  placeholder="John Doe"
                  data-testid="login-name-input"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2D3748] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-default w-full"
                placeholder="admin@example.com"
                data-testid="login-email-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2D3748] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input-default w-full pr-12"
                  placeholder="••••••••"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#2D3748]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
              data-testid="login-submit-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#7C9A92] text-sm hover:underline"
              data-testid="toggle-auth-mode"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <p className="text-center text-[#718096] text-sm mt-6">
          <Link to="/" className="hover:text-[#7C9A92]">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
