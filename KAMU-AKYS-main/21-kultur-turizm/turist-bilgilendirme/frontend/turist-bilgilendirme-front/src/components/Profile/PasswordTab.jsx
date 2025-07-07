import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { ButtonLoader } from '../UI/LoadingSpinner';

const PasswordTab = ({ changePassword, isLoading }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const passwordForm = useForm();

  const onPasswordSubmit = async (data) => {
    const result = await changePassword(data);
    if (result.success) {
      passwordForm.reset();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Şifre Değiştir</h2>
      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Mevcut Şifre</label>
          <div className="relative">
            <input
              {...passwordForm.register('currentPassword', { required: 'Mevcut şifre gerekli' })}
              type={showCurrentPassword ? 'text' : 'password'}
              className="block w-full px-4 py-3 pr-12 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
              placeholder="Mevcut şifreniz"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-200"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordForm.formState.errors.currentPassword && (
            <p className="mt-1 text-sm text-red-400">{passwordForm.formState.errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Yeni Şifre</label>
          <div className="relative">
            <input
              {...passwordForm.register('newPassword', {
                required: 'Yeni şifre gerekli',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalı'
                }
              })}
              type={showNewPassword ? 'text' : 'password'}
              className="block w-full px-4 py-3 pr-12 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
              placeholder="Yeni şifreniz"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-200"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordForm.formState.errors.newPassword && (
            <p className="mt-1 text-sm text-red-400">{passwordForm.formState.errors.newPassword.message}</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            {passwordForm.formState.isSubmitting ? (
              <>
                <ButtonLoader className="mr-2" />
                Güncelleniyor...
              </>
            ) : (
              'Şifreyi Değiştir'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab; 