// View: monta a tela de login.
import { logoIcone } from "./logo.js";

export function mostrarLogin(app: HTMLElement): void {
  app.innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="login-logo">${logoIcone(64)}</div>
        <h1>Manu<span class="azul">Tech</span></h1>
        <p class="subtitulo">Sistema de chamados de manutenção de equipamentos.</p>

        <form id="form-login">
          <div class="campo">
            <label for="usuario">Usuário</label>
            <input id="usuario" name="usuario" type="text" placeholder="Digite seu usuário" required>
          </div>
          <div class="campo">
            <label for="senha">Senha</label>
            <input id="senha" name="senha" type="password" placeholder="Digite sua senha" required>
          </div>
          <p id="mensagem-erro" class="erro"></p>
          <button class="botao" type="submit">Entrar no sistema</button>
        </form>
        <p class="dica">Acesso demonstrativo: aluno / aluno123</p>
      </div>
    </section>
  `;
}