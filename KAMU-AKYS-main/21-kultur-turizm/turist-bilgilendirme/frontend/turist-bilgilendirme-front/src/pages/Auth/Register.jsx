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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <ButtonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 animate-bounce-gentle">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Hesap Oluşturun
          </h2>
          <p className="mt-3 text-gray-300">
            Zaten hesabınız var mı?{' '}
            <Link
              to="/login"
              className="font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              giriş yapın
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-10 p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Global Error */}
            {errors.root && (
              <div className="bg-red-500 bg-opacity-10 backdrop-blur-lg border border-red-500 border-opacity-20 rounded-xl p-4 animate-shake">
                <p className="text-sm text-red-400 font-medium">{errors.root.message}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white"
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-400 animate-slide-down">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white"
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-400 animate-slide-down">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white"
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 animate-slide-down">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Telefon <span className="text-gray-500">(Opsiyonel)</span>
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
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white"
                  placeholder="+90 5XX XXX XX XX"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-400 animate-slide-down">{errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 pr-12 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white"
                    placeholder="Güçlü bir şifre oluşturun"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-200"
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
                  <p className="mt-2 text-sm text-red-400 animate-slide-down">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre Tekrarı
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Şifre tekrarı gerekli',
                      validate: value => value === password || 'Şifreler eşleşmiyor'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white"
                    placeholder="Şifrenizi tekrar girin"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-200"
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
                  <p className="mt-2 text-sm text-red-400 animate-slide-down">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                {...register('acceptTerms', {
                  required: 'Kullanım koşullarını kabul etmelisiniz'
                })}
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 bg-gray-800 rounded transition-colors duration-200 mt-1"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-300">
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline">
                  Kullanım Koşulları
                </Link>{' '}
                ve{' '}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Gizlilik Politikası
                </Link>
                'nı okudum ve kabul ediyorum.
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-400 animate-slide-down">{errors.acceptTerms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
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
      </div>
    </div>
  );
};

export default Register; 