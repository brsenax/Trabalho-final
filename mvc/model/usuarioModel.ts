import { User } from '../../src/entities/user.js'; // Ajuste o caminho conforme necessário

// Lista de usuários utilizando a entidade User
const usuarios: User[] = [
  new User(1, 'Administrador', 82999999999, 'admin@ifal.edu.br', '123'),
  new User(2, 'Aluno Teste', 82988888888, 'aluno@ifal.edu.br', '123')
];

export function validarUsuario(email: string, senha: string): User | null {
  // Procura o usuário que corresponde ao e-mail e senha
  const usuarioEncontrado = usuarios.find(
    u => u.email === email && u.senha === senha
  );

  return usuarioEncontrado || null;
}