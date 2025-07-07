import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

const DestinationManagement = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/destinations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Destinasyonlar alınamadı');
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu destinasyonu silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${API_BASE}/destinations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Destinasyon silinemedi');
      setDestinations(destinations.filter(d => d._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">Hata: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Destinasyon Yönetimi</h2>
      <table className="min-w-full bg-white border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Ad (TR)</th>
            <th className="py-2 px-4">Kategori</th>
            <th className="py-2 px-4">Şehir</th>
            <th className="py-2 px-4">Durum</th>
            <th className="py-2 px-4">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map(dest => (
            <tr key={dest._id} className="border-b">
              <td className="py-2 px-4">{dest.name?.tr}</td>
              <td className="py-2 px-4">{dest.category}</td>
              <td className="py-2 px-4">{dest.location?.city}</td>
              <td className="py-2 px-4">{dest.isActive ? 'Aktif' : 'Pasif'}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(dest._id)}
                >
                  Sil
                </button>
                {/* Düzenle butonu ve modalı eklenebilir */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DestinationManagement; 