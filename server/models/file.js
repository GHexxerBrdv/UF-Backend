import { pool } from '../database/db.js';

export const createFile = async ({ path, name }) => {
  const query = 'INSERT INTO files (path, name) VALUES ($1, $2) RETURNING *;';
  const result = await pool.query(query, [path, name]);
  return result.rows[0];
};

export const getFileById = async (id) => {
  const query = 'SELECT * FROM files WHERE id = $1;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const incrementDownloadCount = async (id) => {
  const query = 'UPDATE files SET download_content = download_content + 1 WHERE id = $1 RETURNING *;';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export default {
  createFile,
  getFileById,
  incrementDownloadCount
};