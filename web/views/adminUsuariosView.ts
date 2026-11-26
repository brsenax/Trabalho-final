import { usuarioApi } from '../clients/usuarioApi';

export async function renderAdminUsuarios(container: HTMLElement) {
  const usuarios = await usuarioApi.listar();

  container.innerHTML = `
    <div class="admin-crud">
      <h2>Gerenciar Usuários</h2>
      
      <form id="form-usuario" class="card-form">
        <input type="hidden" id="usuario-id" />
        <input type="text" id="usuario-nome" placeholder="Nome completo" required />
        <input type="email" id="usuario-email" placeholder="E-mail" required />
        <input type="password" id="usuario-senha" placeholder="Senha" required />
        <input type="text" id="usuario-telefone" placeholder="Telefone" />
        <button type="submit" id="btn-salvar">Salvar Usuário</button>
        <button type="button" id="btn-cancelar" style="display:none;">Cancelar Edição</button>
      </form>

      <table class="tabela-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${usuarios.map(u => `
            <tr>
              <td>${u.id_user}</td>
              <td>${u.nome}</td>
              <td>${u.email}</td>
              <td>${u.telefone || '-'}</td>
              <td>
                <button class="btn-editar" data-id="${u.id_user}" data-nome="${u.nome}" data-email="${u.email}" data-tel="${u.telefone || ''}">Editar</button>
                <button class="btn-excluir" data-id="${u.id_user}">Excluir</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const form = container.querySelector('#form-usuario') as HTMLFormElement;
  const inputId = container.querySelector('#usuario-id') as HTMLInputElement;
  const inputNome = container.querySelector('#usuario-nome') as HTMLInputElement;
  const inputEmail = container.querySelector('#usuario-email') as HTMLInputElement;
  const inputSenha = container.querySelector('#usuario-senha') as HTMLInputElement;
  const inputTel = container.querySelector('#usuario-telefone') as HTMLInputElement;
  const btnCancelar = container.querySelector('#btn-cancelar') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = inputId.value ? Number(inputId.value) : null;
    const payload = {
      nome: inputNome.value,
      email: inputEmail.value,
      senha: inputSenha.value,
      telefone: inputTel.value ? Number(inputTel.value) : 0,
    };

    if (id) {
      await usuarioApi.atualizar(id, payload);
    } else {
      await usuarioApi.criar(payload);
    }
    renderAdminUsuarios(container);
  });

  container.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      inputId.value = target.dataset.id!;
      inputNome.value = target.dataset.nome!;
      inputEmail.value = target.dataset.email!;
      inputTel.value = target.dataset.tel!;
      inputSenha.required = false;
      btnCancelar.style.display = 'inline-block';
    });
  });

  btnCancelar.addEventListener('click', () => {
    form.reset();
    inputId.value = '';
    inputSenha.required = true;
    btnCancelar.style.display = 'none';
  });

  container.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = Number((e.currentTarget as HTMLElement).dataset.id);
      if (confirm('Deseja realmente excluir este usuário?')) {
        await usuarioApi.excluir(id);
        renderAdminUsuarios(container);
      }
    });
  });
}