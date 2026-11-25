//JWT_SECRET ainda a definir no ambiente
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-troque-em-producao";
export const JWT_EXPIRA_EM = "8h";
export const PORTA = Number(process.env.PORT ?? 3000);
