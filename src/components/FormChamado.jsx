import { useState } from 'react';

export function FormChamado({ usuarios, setores, categorias, equipamentos, onAbrirChamado }) {
  // Um estado para cada campo do formulário
  const [usuarioId, setUsuarioId] = useState('');
  const [setorId, setSetorId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [prioridade, setPrioridade] = useState('baixa');
  const [descricao, setDescricao] = useState('');

  // Mostra só os equipamentos do setor escolhido
  const equipamentosDoSetor = equipamentos.filter((e) => e.setorId === Number(setorId));

  function enviar(evento) {
    evento.preventDefault(); // impede a página de recarregar

    onAbrirChamado({
      // O valor de um <select> vem como texto, por isso usamos Number()
      usuarioId: Number(usuarioId),
      setorId: Number(setorId),
      categoriaId: Number(categoriaId),
      equipamentoId: equipamentoId === '' ? null : Number(equipamentoId), // equipamento é opcional
      prioridade: prioridade,
      descricao: descricao.trim(),
    });

    // Limpa o formulário
    setUsuarioId('');
    setSetorId('');
    setCategoriaId('');
    setEquipamentoId('');
    setPrioridade('baixa');
    setDescricao('');
  }

  return (
    <div className="card">
      <h2>Novo Chamado</h2>

      <form onSubmit={enviar}>
        <div className="form-group">
          <label>Solicitante</label>
          <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} required>
            <option value="">Selecione...</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nome}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Setor</label>
          <select
            value={setorId}
            onChange={(e) => {
              setSetorId(e.target.value);
              setEquipamentoId(''); // ao trocar de setor, limpa o equipamento escolhido
            }}
            required
          >
            <option value="">Selecione...</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Equipamento (se houver)</label>
          <select
            value={equipamentoId}
            onChange={(e) => setEquipamentoId(e.target.value)}
            disabled={setorId === ''}
          >
            <option value="">
              {setorId === '' ? 'Escolha o setor primeiro' : 'Nenhum / não se aplica'}
            </option>
            {equipamentosDoSetor.map((eq) => (
              <option key={eq.id} value={eq.id}>{eq.nome}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Prioridade</label>
          <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descrição do problema</label>
          <textarea
            rows="3"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary">Abrir chamado</button>
      </form>
    </div>
  );
}