import { useState } from 'react';
import { ListaChamados } from './ListaChamados';
import { situacoes, soDia } from '../utils';

export function Consulta({
  chamados, setores, categorias, equipamentos, tecnicos, prazos, onSelecionar,
}) {
  const [situacao, setSituacao] = useState('');
  const [setorId, setSetorId] = useState('');
  const [tecnicoId, setTecnicoId] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  // Cada "if" descarta o chamado que não combina com o filtro.
  // Se o filtro está vazio, ele não filtra nada.
  const chamadosFiltrados = chamados.filter((c) => {
    if (situacao !== '' && c.status !== situacao) return false;
    if (setorId !== '' && c.setorId !== Number(setorId)) return false;
    if (tecnicoId !== '' && c.tecnicoId !== Number(tecnicoId)) return false;
    if (dataInicial !== '' && soDia(c.dataAbertura) < dataInicial) return false;
    if (dataFinal !== '' && soDia(c.dataAbertura) > dataFinal) return false;
    return true; // passou em todos os filtros
  });

  return (
    <div>
      <div className="card">
        <h2>Consultar chamados</h2>
        <div className="grid">
          <div>
            <label>Situação</label>
            <select value={situacao} onChange={(e) => setSituacao(e.target.value)}>
              <option value="">Todas</option>
              {situacoes.map((s) => (
                <option key={s.valor} value={s.valor}>{s.texto}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Setor</label>
            <select value={setorId} onChange={(e) => setSetorId(e.target.value)}>
              <option value="">Todos</option>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Técnico</label>
            <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)}>
              <option value="">Todos</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Aberto a partir de</label>
            <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
          </div>

          <div>
            <label>Aberto até</label>
            <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
          </div>
        </div>
      </div>

      <ListaChamados
        titulo="Resultado"
        chamados={chamadosFiltrados}
        setores={setores}
        categorias={categorias}
        equipamentos={equipamentos}
        tecnicos={tecnicos}
        prazos={prazos}
        onSelecionar={onSelecionar}
      />
    </div>
  );
}