import type { Chamado } from "../types";
import { ROTULO_PRIORIDADE, ROTULO_STATUS } from "../rotulos";

/** Escapa texto digitado pelo usuário antes de colocar em innerHTML (evita XSS). */
export function esc(texto: string | number): string {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function mostrarErro(elemento: HTMLElement, erro: unknown): void {
  elemento.innerHTML = `<p style="color:#dc2626">${esc(erro instanceof Error ? erro.message : "Erro inesperado.")}</p>`;
}

export function tabelaChamados(chamados: Chamado[], mostrarSolicitante = false): string {
  const colunas = mostrarSolicitante ? 8 : 7;
  const linhas = chamados.length === 0
    ? `<tr><td colspan="${colunas}" style="text-align:center;color:#64748b;padding:20px;">Nenhum chamado cadastrado ainda.</td></tr>`
    : chamados.map((c) => `
        <tr>
          <td>#${String(c.id).padStart(4, "0")}</td>
          <td>${esc(c.titulo)}</td>
          ${mostrarSolicitante ? `<td>${esc(c.solicitante)}</td>` : ""}
          <td>${esc(c.setor)}</td>
          <td>${ROTULO_PRIORIDADE[c.prioridade]}</td>
          <td>${ROTULO_STATUS[c.status]}</td>
          <td>${formatarData(c.data_abertura)}</td>
          <td>${formatarDataHora(c.prazo)}</td>
        </tr>`).join("");

  return `
    <table class="tabela">
      <thead><tr><th>Nº</th><th>Título</th>${mostrarSolicitante ? "<th>Solicitante</th>" : ""}<th>Setor</th><th>Prioridade</th><th>Status</th><th>Abertura</th><th>Prazo</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>`;
}