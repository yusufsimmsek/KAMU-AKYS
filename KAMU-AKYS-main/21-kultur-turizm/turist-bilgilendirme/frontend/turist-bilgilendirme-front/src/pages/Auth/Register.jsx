import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, UserPlus, MapPin } from 'lucide-react';
import { ButtonLoader } from '../../components/UI/LoadingSpinner';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch
  } = useForm();

  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const onSubmit = async (data) => {
    // Remove confirmPassword from data
    const { confirmPassword, ...userData } = data;
    
    const result = await registerUser(userData);
    
    if (result.success) {
      navigate('/login', { 
        state: { message: 'Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.' }
      });
    } else {
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

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-gentle">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Hesap Oluşturun
          </h2>
          <p className="mt-3 text-dark-500">
            Zaten hesabınız var mı?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-300"
            >
              giriş yapın
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Global Error */}
            {errors.root && (
              <div className="bg-gradient-to-r from-error-50 to-error-100 border border-error-200 rounded-xl p-4 animate-shake">
                <p className="text-sm text-error-600 font-medium">{errors.root.message}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-dark-700 mb-2">
                    Ad
                  </label>
                  <input
                    {...register('firstName', {
                      required: 'Ad gerekli',
                      minLength: {
                        value: 2,
                        message: 'Ad en az 2 karakter olmalı'
                      }
                    })}
                    type="text"
                    autoComplete="given-name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-error-500 animate-slide-down">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-dark-700 mb-2">
                    Soyad
                  </label>
                  <input
                    {...register('lastName', {
                      required: 'Soyad gerekli',
                      minLength: {
                        value: 2,
                        message: 'Soyad en az 2 karakter olmalı'
                      }
                    })}
                    type="text"
                    autoComplete="family-name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-error-500 animate-slide-down">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

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

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-dark-700 mb-2">
                  Telefon <span className="text-gray-400">(Opsiyonel)</span>
                </label>
                <input
                  {...register('phone', {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Geçerli bir telefon numarası girin'
                    }
                  })}
                  type="tel"
                  autoComplete="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="+90 5XX XXX XX XX"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-error-500 animate-slide-down">{errors.phone.message}</p>
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
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermeli'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Güçlü bir şifre oluşturun"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-700 mb-2">
                  Şifre Tekrarı
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Şifre tekrarı gerekli',
                      validate: value =>
                        value === password || 'Şifreler eşleşmiyor'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Şifrenizi tekrar girin"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-500 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-error-500 animate-slide-down">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                {...register('terms', {
                  required: 'Kullanım şartlarını kabul etmelisiniz'
                })}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-300 border-gray-300 rounded mt-1 transition-colors duration-200"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-dark-600">
                <span className="font-medium">Kullanım şartları</span> ve{' '}
                <span className="font-medium">gizlilik politikası</span>'nı okudum ve kabul ediyorum.
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-error-500 animate-slide-down">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <ButtonLoader className="mr-2" />
                  Hesap oluşturuluyor...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Hesap Oluştur
                </>
              )}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-info-50 to-primary-50 border border-info-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-info-400 to-primary-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">ℹ</span>
              </div>
            </div>
            <div className="text-sm text-info-700">
              <p className="font-medium mb-1">Güvenli hesap oluşturma</p>
              <p className="text-xs">Bilgileriniz 256-bit SSL şifreleme ile korunur. E-posta adresiniz doğrulama için kullanılacaktır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 