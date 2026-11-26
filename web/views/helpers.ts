import type { Chamado } from "../types";

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

export function mostrarErro(elemento: HTMLElement, erro: unknown): void {
  elemento.innerHTML = `<p style="color:#dc2626">${esc(erro instanceof Error ? erro.message : "Erro inesperado.")}</p>`;
}

export function tabelaChamados(chamados: (Chamado & { solicitante?: string })[], mostrarSolicitante = false): string {
  const linhas = chamados.length === 0
    ? `<tr><td colspan="${mostrarSolicitante ? 7 : 6}" style="text-align:center;color:#64748b;padding:20px;">Nenhum chamado cadastrado ainda.</td></tr>`
    : chamados.map((c) => `
        <tr>
          <td>#${String(c.id).padStart(4, "0")}</td>
          <td>${esc(c.descricao)}</td>
          ${mostrarSolicitante ? `<td>${esc(c.solicitante ?? "")}</td>` : ""}
          <td>${esc(c.setor)}</td>
          <td>${esc(c.prioridade)}</td>
          <td>${esc(c.status)}</td>
          <td>${formatarData(c.data_abertura)}</td>
        </tr>`).join("");

  return `
    <table class="tabela">
      <thead><tr><th>Nº</th><th>Descrição</th>${mostrarSolicitante ? "<th>Solicitante</th>" : ""}<th>Setor</th><th>Prioridade</th><th>Status</th><th>Data</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>`;
}
