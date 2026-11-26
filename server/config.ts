// Os valores vêm do arquivo .env (carregado em server.ts). Veja .env.example.
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-troque-em-producao";
export const JWT_EXPIRA_EM = "8h";
export const PORTA = Number(process.env.PORT ?? 3000);

export const DB = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "central_chamados",
};