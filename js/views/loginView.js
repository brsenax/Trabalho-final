// View: monta a tela de login.
export function mostrarLogin(app) {
  app.innerHTML = `
    <section class="login-page">
      <div class="login-card">
        <div class="logo">M</div>
        <h1>Bem-vindo</h1>
        <p class="subtitulo">Entre no sistema de chamados de manutenção.</p>

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
