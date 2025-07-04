import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, LogIn, MapPin } from 'lucide-react';
import { ButtonLoader } from '../../components/UI/LoadingSpinner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const onSubmit = async (data) => {
    const result = await login(data);
    
    if (!result.success) {
      setError('root', { message: result.error });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ButtonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-gentle">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Hoş Geldiniz
          </h2>
          <p className="mt-3 text-dark-500">
            Hesabınıza giriş yapın veya{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-300"
            >
              yeni hesap oluşturun
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Global Error */}
            {errors.root && (
              <div className="bg-gradient-to-r from-error-50 to-error-100 border border-error-200 rounded-xl p-4 animate-shake">
                <p className="text-sm text-error-600 font-medium">{errors.root.message}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">
                  E-posta adresi
                </label>
                <input
                  {...register('email', {
                    required: 'E-posta adresi gerekli',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Geçerli bir e-posta adresi girin'
                    }
                  })}
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-error-500 animate-slide-down">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Şifre gerekli',
                      minLength: {
                        value: 6,
                        message: 'Şifre en az 6 karakter olmalı'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Şifrenizi girin"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-error-500 animate-slide-down">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-300 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-dark-600">
                  Beni hatırla
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Şifremi unuttum
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <ButtonLoader className="mr-2" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Giriş Yap
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-gradient-to-r from-info-50 to-primary-50 border border-info-200 rounded-xl p-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-info-700 mb-3">🎯 Demo Hesapları</h3>
          <div className="text-xs text-info-600 space-y-2">
            <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
              <span><strong>Kullanıcı:</strong> user@demo.com</span>
              <span className="font-mono text-primary-600">123456</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
              <span><strong>Admin:</strong> admin@demo.com</span>
              <span className="font-mono text-primary-600">123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 