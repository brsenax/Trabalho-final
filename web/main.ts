import { limparSessao, obterSessao } from "./sessao";
import { renderLogin } from "./views/loginView";
import { montarLayout, telaInicialDo, type Tela } from "./views/layout";
import { renderVisaoGeral } from "./views/visaoGeralView";
import { renderMeusChamados } from "./views/meusChamadosView";
import { renderAbrirChamado } from "./views/abrirChamadoView";
import { renderRelatorios } from "./views/relatoriosView";
import { renderAdminDashboard } from "./views/adminDashboardView";
import { renderAdminUsuarios } from "./views/adminUsuariosView";
import type { Usuario } from "./types";

const app = document.querySelector<HTMLElement>("#app")!;

const telas: Record<Tela, (pagina: HTMLElement) => void | Promise<void>> = {
  "visao-geral": renderVisaoGeral,
  "meus-chamados": renderMeusChamados,
  "abrir-chamado": renderAbrirChamado,
  "relatorios": renderRelatorios,
  "admin-dashboard": renderAdminDashboard,
  "admin-usuarios": renderAdminUsuarios,
};

function abrirTela(tela: Tela, usuario: Usuario): void {
  const pagina = montarLayout(app, usuario, tela, (t) => abrirTela(t, usuario), sair);
  void telas[tela](pagina);
}

function sair(): void {
  limparSessao();
  iniciar();
}

// Depois do login, cada perfil cai na sua própria tela inicial (admin -> Dashboard).
function iniciar(): void {
  let sessao = obterSessao();

  // Sessão salva por uma versão antiga (sem perfil) não serve mais: pede login de novo.
  if (sessao && !sessao.usuario.perfil) {
    limparSessao();
    sessao = null;
  }

  if (sessao) abrirTela(telaInicialDo(sessao.usuario), sessao.usuario);
  else renderLogin(app, iniciar);
}

iniciar();
