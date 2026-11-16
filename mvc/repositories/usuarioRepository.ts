import { User } from "../../src/entities/user.js";

export class UsuarioRepository {
  private usuarios: User[] = [
    new User(1, "Administrador", 82999999999, "admin@ifal.edu.br", "123"),
    new User(2, "Aluno Teste", 82988888888, "aluno@ifal.edu.br", "123")
  ];

  public buscarPorEmailESenha(email: string, senha: string): User | undefined {
    return this.usuarios.find(
      usuario => usuario.email === email && usuario.senha === senha
    );
  }
}
