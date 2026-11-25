import type { Usuario } from "../types";
import { esc } from "./helpers";

export type Tela =
  | "visao-geral" | "meus-chamados" | "abrir-chamado" | "relatorios"   // usuário comum
  | "admin-dashboard" | "admin-usuarios";                               // administrador

interface ItemMenu { tela: Tela; texto: string }

const MENU_USUARIO: ItemMenu[] = [
  { tela: "visao-geral", texto: "Visão geral" },
  { tela: "meus-chamados", texto: "Meus chamados" },
  { tela: "abrir-chamado", texto: "Abrir chamado" },
  { tela: "relatorios", texto: "Relatórios" },
];

const MENU_ADMIN: ItemMenu[] = [
  { tela: "admin-dashboard", texto: "Dashboard" },
  { tela: "admin-usuarios", texto: "Usuários" },
];

export const menuDo = (usuario: Usuario): ItemMenu[] =>
  usuario.perfil === "admin" ? MENU_ADMIN : MENU_USUARIO;

export const telaInicialDo = (usuario: Usuario): Tela => menuDo(usuario)[0].tela;

/** Desenha a moldura (menu + topo) uma única vez e devolve a área onde a tela atual deve renderizar. */
export function montarLayout(
  app: HTMLElement,
  usuario: Usuario,
  ativa: Tela,
  aoNavegar: (tela: Tela) => void,
  aoSair: () => void
): HTMLElement {
  const admin = usuario.perfil === "admin";

  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="marca"><span class="marca-icone">M</span> Manutenção</div>
        <p class="menu-titulo">${admin ? "Administração" : "Menu principal"}</p>
        <nav class="menu">
          ${menuDo(usuario).map((m) => `<a href="#" data-tela="${m.tela}" class="${m.tela === ativa ? "ativo" : ""}">${m.texto}</a>`).join("")}
        </nav>
      </aside>
      <section class="conteudo">
        <header class="topo">
          <strong>${admin ? "Painel do administrador" : "Painel de controle"}</strong>
          <div>
            <span class="usuario">Olá, ${esc(usuario.nome)}</span>
            <button class="sair" id="botao-sair">Sair</button>
          </div>
        </header>
        <main class="pagina" id="pagina"></main>
      </section>
    </div>`;

  app.querySelectorAll<HTMLAnchorElement>(".menu a").forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      aoNavegar(link.dataset.tela as Tela);
    })
  );
  app.querySelector("#botao-sair")!.addEventListener("click", aoSair);

  return app.querySelector<HTMLElement>("#pagina")!;
}
