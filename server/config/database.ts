import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'seu_usuario',
  database: 'sua_base_de_dados',
  password: 'sua_senha',
  waitForConnections: true,
  connectionLimit: 10,
});