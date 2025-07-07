import { useState } from 'react';

const SettingsTab = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [notifications, setNotifications] = useState(true);

  const handleThemeChange = (e) => {
    const value = e.target.value;
    setTheme(value);
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('dark', value === 'dark');
  };

  const handleNotificationsChange = (e) => {
    setNotifications(e.target.checked);
  };

  const handleLogout = () => {
    // Mock logout
    alert('Çıkış yapıldı (mock)');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Hesabınızı silmek istediğinize emin misiniz? (mock)')) {
      alert('Hesap silindi (mock)');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Ayarlar</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tema</label>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="light">Açık</option>
            <option value="dark">Koyu</option>
          </select>
        </div>
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifications}
              onChange={handleNotificationsChange}
              className="form-checkbox h-5 w-5 text-purple-600"
            />
            <span className="text-gray-300">Bildirimleri Aç</span>
          </label>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            Çıkış Yap
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
          >
            Hesabı Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab; 