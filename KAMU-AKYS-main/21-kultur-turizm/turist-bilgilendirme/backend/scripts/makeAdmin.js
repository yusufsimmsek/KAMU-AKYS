const { Pool } = require('pg');

// Veritabanı bağlantı bilgileri
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tourist_info',
  password: 'postgres', // PostgreSQL'in varsayılan şifresi
  port: 5432,
});

async function makeAdmin() {
  try {
    // Kullanıcı rolünü güncelle
    const updateQuery = 'UPDATE users SET role = $1 WHERE email = $2 RETURNING *';
    const result = await pool.query(updateQuery, ['admin', 'csfsmk@gmail.com']);

    if (result.rows.length === 0) {
      console.log('Kullanıcı bulunamadı');
    } else {
      console.log('Kullanıcı rolü güncellendi:', result.rows[0]);
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

makeAdmin(); 