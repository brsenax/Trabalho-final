import { nomeSituacao, nomeDe, prazoFinal, estaAtrasado, formatarData } from '../utils';

export function ListaChamados({
  titulo, chamados, setores, categorias, equipamentos, tecnicos, prazos, onSelecionar,
}) {
  return (
    <div className="card">
      <h2>{titulo} ({chamados.length})</h2>

      {chamados.length === 0 && <p className="texto-pequeno">Nenhum chamado encontrado.</p>}

      {chamados.map((chamado) => {
        const atrasado = estaAtrasado(chamado, prazos);

        return (
          <div key={chamado.id} className={atrasado ? 'chamado-item atrasado' : 'chamado-item'}>
            <div className="chamado-topo">
              <span>
                #{chamado.id} - {chamado.equipamentoId ? nomeDe(equipamentos, chamado.equipamentoId) : 'Sem equipamento'}
              </span>
              <span>
                <span className={'badge status-' + chamado.status}>{nomeSituacao(chamado.status)}</span>
                <span className={'badge prioridade-' + chamado.prioridade}>{chamado.prioridade}</span>
              </span>
            </div>

            <p className="texto-pequeno">
              Setor: {nomeDe(setores, chamado.setorId)} | Categoria: {nomeDe(categorias, chamado.categoriaId)} |
              Técnico: {chamado.tecnicoId ? nomeDe(tecnicos, chamado.tecnicoId) : 'não atribuído'}
            </p>

            <p style={{ margin: '8px 0', fontSize: '14px' }}>{chamado.descricao}</p>

            <p className={atrasado ? 'texto-pequeno texto-atrasado' : 'texto-pequeno'}>
              Prazo: {formatarData(prazoFinal(chamado, prazos))}
              {atrasado && ' - FORA DO PRAZO'}
            </p>

            <button className="btn-secundario" onClick={() => onSelecionar(chamado.id)}>
              Ver detalhes
            </button>
          </div>
        );
      })}
    </div>
  );
}