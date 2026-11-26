import mysql from "mysql2/promise";
import { DB } from "../config.js";

/** Pool de conexões compartilhado por todos os repositories MySQL. */
export const pool = mysql.createPool({
  ...DB,
  waitForConnections: true,
  connectionLimit: 10,
});