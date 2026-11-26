import { login, recuperarSenha } from "../clients/usuarioApi";
import { salvarSessao } from "../sessao";

export function renderLogin(app: HTMLElement, aoLogar: () => void): void {
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-box">M</div>
        <h1 id="titulo-card">Bem-vindo</h1>
        <p id="subtitulo-card">Entre no sistema de chamados de manutenção.</p>

        <form id="form-login">
          <div class="form-group">
            <label for="email">Usuário / E-mail</label>
            <input type="email" id="email" placeholder="Digite seu e-mail" required />
          </div>
          <div class="form-group">
            <label for="senha">Senha</label>
            <input type="password" id="senha" placeholder="Digite sua senha" required />
            <div style="text-align:right;margin-top:6px;">
              <a href="#" id="link-esqueceu-senha" style="font-size:.85rem;color:#2563eb;text-decoration:none;">Esqueceu a senha?</a>
            </div>
          </div>
          <button type="submit" class="btn-primary">Entrar no sistema</button>
        </form>

        <form id="form-recuperar" style="display:none;">
          <div class="form-group">
            <label for="rec-email">E-mail cadastrado</label>
            <input type="email" id="rec-email" placeholder="Digite seu e-mail" required />
          </div>
          <div class="form-group">
            <label for="rec-nova-senha">Nova Senha</label>
            <input type="password" id="rec-nova-senha" placeholder="Digite a nova senha" required />
          </div>
          <button type="submit" class="btn-primary">Redefinir senha</button>
          <div style="text-align:center;margin-top:12px;">
            <a href="#" id="link-voltar-login" style="font-size:.85rem;color:#64748b;text-decoration:none;">Voltar para o login</a>
          </div>
        </form>

        <p id="mensagem-feedback" style="margin-top:12px;font-size:.9rem;text-align:center;"></p>
      </div>
    </div>`;

  const $ = <T extends HTMLElement>(id: string) => app.querySelector<T>(`#${id}`)!;
  const formLogin = $<HTMLFormElement>("form-login");
  const formRecuperar = $<HTMLFormElement>("form-recuperar");
  const titulo = $("titulo-card");
  const subtitulo = $("subtitulo-card");
  const feedback = $("mensagem-feedback");

  const avisar = (texto: string, ok: boolean) => {
    feedback.style.color = ok ? "#16a34a" : "#dc2626";
    feedback.textContent = texto;
  };

  const alternar = (recuperando: boolean) => {
    formLogin.style.display = recuperando ? "none" : "block";
    formRecuperar.style.display = recuperando ? "block" : "none";
    titulo.textContent = recuperando ? "Recuperar Senha" : "Bem-vindo";
    subtitulo.textContent = recuperando
      ? "Informe seu e-mail e defina uma nova senha."
      : "Entre no sistema de chamados de manutenção.";
    feedback.textContent = "";
  };

  $("link-esqueceu-senha").addEventListener("click", (e) => { e.preventDefault(); alternar(true); });
  $("link-voltar-login").addEventListener("click", (e) => { e.preventDefault(); alternar(false); });

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const { token, usuario } = await login($<HTMLInputElement>("email").value, $<HTMLInputElement>("senha").value);
      salvarSessao({ token, usuario });
      aoLogar();
    } catch (erro) {
      avisar(erro instanceof Error ? erro.message : "Erro ao fazer login.", false);
    }
  });

  formRecuperar.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const { mensagem } = await recuperarSenha(
        $<HTMLInputElement>("rec-email").value,
        $<HTMLInputElement>("rec-nova-senha").value
      );
      avisar(mensagem, true);
      formRecuperar.reset();
    } catch (erro) {
      avisar(erro instanceof Error ? erro.message : "Erro ao redefinir senha.", false);
    }
  });
}
