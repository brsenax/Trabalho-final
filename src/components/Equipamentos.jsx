import { useState } from 'react';
import { nomeDe } from '../utils';

export function Equipamentos({ equipamentos, setores, onCadastrar }) {
  const [nome, setNome] = useState('');
  const [setorId, setSetorId] = useState('');

  function enviar(evento) {
    evento.preventDefault();
    onCadastrar({ nome: nome.trim(), setorId: Number(setorId) });
    setNome('');
    setSetorId('');
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Novo equipamento</h2>
        <form onSubmit={enviar}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Ex: Impressora HP"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Setor</label>
            <select value={setorId} onChange={(e) => setSetorId(e.target.value)} required>
              <option value="">Selecione...</option>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">Cadastrar</button>
        </form>
      </div>

      <div className="card">
        <h2>Equipamentos cadastrados ({equipamentos.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Setor</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos.map((eq) => (
              <tr key={eq.id}>
                <td>{eq.nome}</td>
                <td>{nomeDe(setores, eq.setorId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}