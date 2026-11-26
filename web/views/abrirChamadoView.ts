import { criarChamado } from "../clients/chamadoApi";
import type { Prioridade } from "../types";

export function renderAbrirChamado(pagina: HTMLElement): void {
  pagina.innerHTML = `
    <h1>Abrir Chamado</h1>
    <p class="descricao">Preencha os dados abaixo para registrar uma nova solicitação de manutenção.</p>

    <div class="login-card" style="max-width:600px;margin:0;">
      <form id="form-chamado">
        <div class="form-group">
          <label for="problema">Descrição do Problema</label>
          <input type="text" id="problema" placeholder="Ex: Computador não liga / Impressora sem papel" required />
        </div>
        <div class="form-group">
          <label for="setor">Setor</label>
          <input type="text" id="setor" placeholder="Ex: Administrativo, Financeiro, Recepção" required />
        </div>
        <div class="form-group">
          <label for="prioridade">Prioridade</label>
          <select id="prioridade">
            <option value="Baixa">Baixa</option>
            <option value="Média" selected>Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Cadastrar Chamado</button>
      </form>
      <p id="mensagem-feedback" style="display:none;margin-top:15px;"></p>
    </div>`;

  const form = pagina.querySelector<HTMLFormElement>("#form-chamado")!;
  const feedback = pagina.querySelector<HTMLElement>("#mensagem-feedback")!;
  const campo = (id: string) => pagina.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      // O frontend só envia os dados; quem valida, numera e guarda é o servidor.
      const { mensagem } = await criarChamado({
        descricao: campo("problema").value,
        setor: campo("setor").value,
        prioridade: campo("prioridade").value as Prioridade,
      });
      feedback.style.color = "#16a34a";
      feedback.textContent = mensagem;
      form.reset();
    } catch (erro) {
      feedback.style.color = "#dc2626";
      feedback.textContent = erro instanceof Error ? erro.message : "Erro ao cadastrar chamado.";
    }

    feedback.style.display = "block";
    setTimeout(() => (feedback.style.display = "none"), 3000);
  });
}
