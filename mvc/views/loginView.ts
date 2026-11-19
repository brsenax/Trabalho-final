export function initLoginView() {
  const formLogin = document.getElementById("form-login") as HTMLFormElement;
  const formRecuperar = document.getElementById("form-recuperar") as HTMLFormElement;
  const linkEsqueceu = document.getElementById("link-esqueceu-senha");
  const linkVoltar = document.getElementById("link-voltar-login");
  const titulo = document.getElementById("titulo-card");
  const subtitulo = document.getElementById("subtitulo-card");
  const feedback = document.getElementById("mensagem-feedback");

  // Alternar para a tela de recuperação de senha
  linkEsqueceu?.addEventListener("click", (e) => {
    e.preventDefault();
    if (formLogin) formLogin.style.display = "none";
    if (formRecuperar) formRecuperar.style.display = "block";
    if (titulo) titulo.textContent = "Recuperar Senha";
    if (subtitulo) subtitulo.textContent = "Informe seu e-mail e defina uma nova senha.";
    if (feedback) feedback.textContent = "";
  });

  // Voltar para a tela de login
  linkVoltar?.addEventListener("click", (e) => {
    e.preventDefault();
    if (formRecuperar) formRecuperar.style.display = "none";
    if (formLogin) formLogin.style.display = "block";
    if (titulo) titulo.textContent = "Bem-vindo";
    if (subtitulo) subtitulo.textContent = "Entre no sistema de chamados de manutenção.";
    if (feedback) feedback.textContent = "";
  });

  // Enviar requisição de login
  formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const senha = (document.getElementById("senha") as HTMLInputElement).value;

    try {
      const resposta = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (feedback) {
          feedback.style.color = "#dc2626";
          feedback.textContent = dados.erro || "Erro ao fazer login.";
        }
        return;
      }

      if (feedback) {
        feedback.style.color = "#16a34a";
        feedback.textContent = "Login bem-sucedido! Redirecionando...";
      }

      // Salva os dados do usuário logado e atualiza a aplicação
      localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));
      window.location.reload();
    } catch {
      if (feedback) {
        feedback.style.color = "#dc2626";
        feedback.textContent = "Erro de conexão com o servidor.";
      }
    }
  });

  // Enviar nova senha para o backend (Recuperação)
  formRecuperar?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("rec-email") as HTMLInputElement).value;
    const novaSenha = (document.getElementById("rec-nova-senha") as HTMLInputElement).value;

    try {
      const resposta = await fetch("http://localhost:3000/api/usuarios/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, novaSenha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (feedback) {
          feedback.style.color = "#dc2626";
          feedback.textContent = dados.erro || "Erro ao redefinir senha.";
        }
        return;
      }

      if (feedback) {
        feedback.style.color = "#16a34a";
        feedback.textContent = dados.mensagem;
      }
      formRecuperar.reset();
    } catch {
      if (feedback) {
        feedback.style.color = "#dc2626";
        feedback.textContent = "Erro de conexão com o servidor.";
      }
    }
  });
}