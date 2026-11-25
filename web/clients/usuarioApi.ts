import { requisicao } from "./http";
import type { Usuario } from "../types";

export function login(email: string, senha: string) {
  return requisicao<{ token: string; usuario: Usuario }>("/usuarios/login", {
    metodo: "POST",
    corpo: { email, senha },
  });
}

export function recuperarSenha(email: string, novaSenha: string) {
  return requisicao<{ mensagem: string }>("/usuarios/recuperar-senha", {
    metodo: "POST",
    corpo: { email, novaSenha },
  });
}
