import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import DestinationManagement from '../components/admin/DestinationManagement';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Kullanıcı bilgisini localStorage veya context'ten al
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('users')}
          >
            Kullanıcı Yönetimi
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'destinations' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('destinations')}
          >
            Destinasyon Yönetimi
          </button>
        </div>
        <div>
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'destinations' && <DestinationManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 