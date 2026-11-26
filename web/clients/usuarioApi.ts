import { requisicao } from './http';
import { Usuario } from '../types';

export interface RespostaLogin {
  token: string;
  usuario: Usuario;
}

export function login(email: string, senha: string): Promise<RespostaLogin> {
  return requisicao<RespostaLogin>('/usuarios/login', {
    metodo: 'POST',
    corpo: { email, senha },
  });
}

export function recuperarSenha(email: string): Promise<{ mensagem: string }> {
  return requisicao<{ mensagem: string }>('/usuarios/recuperar-senha', {
    metodo: 'POST',
    corpo: { email },
  });
}

export const usuarioApi = {
  listar: () => requisicao<Usuario[]>('/usuarios'),
  criar: (dados: Partial<Usuario>) => requisicao<Usuario>('/usuarios', { metodo: 'POST', corpo: dados }),
  atualizar: (id: number, dados: Partial<Usuario>) => requisicao<void>(`/usuarios/${id}`, { metodo: 'PUT', corpo: dados }),
  excluir: (id: number) => requisicao<void>(`/usuarios/${id}`, { metodo: 'DELETE' }),
};