import { useForm } from 'react-hook-form';
import { User, Mail, Phone } from 'lucide-react';
import { ButtonLoader } from '../UI/LoadingSpinner';

const ProfileInfoTab = ({ user, updateProfile, isLoading }) => {
  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const onProfileSubmit = async (data) => {
    await updateProfile(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Profil Bilgileri</h2>
      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ad</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <input
                {...profileForm.register('firstName', { required: 'Ad gerekli' })}
                type="text"
                className="pl-10 block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>
            {profileForm.formState.errors.firstName && (
              <p className="mt-1 text-sm text-red-400">{profileForm.formState.errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Soyad</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <input
                {...profileForm.register('lastName', { required: 'Soyad gerekli' })}
                type="text"
                className="pl-10 block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>
            {profileForm.formState.errors.lastName && (
              <p className="mt-1 text-sm text-red-400">{profileForm.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">E-posta</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
            <input
              {...profileForm.register('email', {
                required: 'E-posta gerekli',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Geçerli bir e-posta adresi girin'
                }
              })}
              type="email"
              className="pl-10 block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
            />
          </div>
          {profileForm.formState.errors.email && (
            <p className="mt-1 text-sm text-red-400">{profileForm.formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Telefon</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
            <input
              {...profileForm.register('phone')}
              type="tel"
              className="pl-10 block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            {profileForm.formState.isSubmitting ? (
              <>
                <ButtonLoader className="mr-2" />
                Güncelleniyor...
              </>
            ) : (
              'Profili Güncelle'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoTab; 