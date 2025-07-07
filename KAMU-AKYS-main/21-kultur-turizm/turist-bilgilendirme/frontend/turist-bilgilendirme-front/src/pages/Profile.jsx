import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Calendar, Settings, Eye, EyeOff } from 'lucide-react';
import { ButtonLoader } from '../components/UI/LoadingSpinner';
import { formatDate } from '../utils';
import useFavorites from '../hooks/useFavorites';
import { toast } from 'react-hot-toast';
import { Star, Trash2 } from 'lucide-react';
import ProfileInfoTab from '../components/Profile/ProfileInfoTab';
import PasswordTab from '../components/Profile/PasswordTab';
import FavoritesTab from '../components/Profile/FavoritesTab';
import SettingsTab from '../components/Profile/SettingsTab';

const Profile = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { favorites, removeFavorite } = useFavorites();

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const passwordForm = useForm();

  const onProfileSubmit = async (data) => {
    await updateProfile(data);
  };

  const onPasswordSubmit = async (data) => {
    const result = await changePassword(data);
    if (result.success) {
      passwordForm.reset();
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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl shadow-2xl border border-white border-opacity-10 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-300">{user?.email}</p>
              <p className="text-sm text-gray-400">
                Üye olma tarihi: {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl shadow-2xl border border-white border-opacity-10 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profil Bilgileri</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-300 ${
                    activeTab === 'password'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Şifre Değiştir</span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-300 ${
                    activeTab === 'favorites'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>Favorilerim</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-300 ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Ayarlar</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl shadow-2xl border border-white border-opacity-10 p-6">
              {activeTab === 'profile' && <ProfileInfoTab user={user} updateProfile={updateProfile} isLoading={isLoading} />}
              {activeTab === 'password' && <PasswordTab changePassword={changePassword} isLoading={isLoading} />}
              {activeTab === 'favorites' && <FavoritesTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 