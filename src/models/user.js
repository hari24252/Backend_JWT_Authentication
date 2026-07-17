const pool = require('../config/db');

const User = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT id, email, password_hash, name, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async findAll() {
    const { rows } = await pool.query(
      'SELECT id, email, name, created_at FROM users ORDER BY id ASC'
    );
    return rows;
  },

  async create({ email, passwordHash, name }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email.toLowerCase(), passwordHash, name]
    );
    return rows[0];
  },
};

module.exports = User;
