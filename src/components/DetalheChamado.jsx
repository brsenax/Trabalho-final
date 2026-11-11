import { useState } from 'react';
import {
  situacoes, nomeSituacao, nomeDe, tecnicoHabilitado, podeReabrir,
  prazoFinal, estaAtrasado, formatarDataHora,
} from '../utils';

export function DetalheChamado({
  chamado, andamentos, setores, categorias, equipamentos, tecnicos, usuarios,
  habilitacoes, prazos, onFechar, onAtribuir, onMudarSituacao, onComentar, onReabrir,
}) {
  const [tecnicoEscolhido, setTecnicoEscolhido] = useState('');
  const [novaSituacao, setNovaSituacao] = useState('em_atendimento');
  const [textoSituacao, setTextoSituacao] = useState('');
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');

  // REGRA: só aparecem técnicos habilitados na categoria deste chamado
  const tecnicosHabilitados = tecnicos.filter((t) =>
    tecnicoHabilitado(t.id, chamado.categoriaId, habilitacoes)
  );

  function atribuir() {
    if (tecnicoEscolhido === '') {
      return;
    }
    const resultado = onAtribuir(chamado.id, Number(tecnicoEscolhido));
    setErro(resultado); // '' se deu certo, texto se deu erro
    setTecnicoEscolhido('');
  }

  function mudarSituacao() {
    const resultado = onMudarSituacao(chamado.id, novaSituacao, textoSituacao);
    setErro(resultado);
    if (resultado === '') {
      setTextoSituacao('');
    }
  }

  function comentar() {
    const resultado = onComentar(chamado.id, comentario);
    setErro(resultado);
    if (resultado === '') {
      setComentario('');
    }
  }

  function reabrir() {
    setErro(onReabrir(chamado.id));
  }

  const atrasado = estaAtrasado(chamado, prazos);

  return (
    <div className="card">
      <div className="chamado-topo">
        <h2>Chamado #{chamado.id}</h2>
        <button className="btn-secundario" onClick={onFechar}>Fechar</button>
      </div>

      <p>
        <span className={'badge status-' + chamado.status}>{nomeSituacao(chamado.status)}</span>
        <span className={'badge prioridade-' + chamado.prioridade}>{chamado.prioridade}</span>
      </p>

      <p style={{ margin: '10px 0' }}>{chamado.descricao}</p>

      <p className="texto-pequeno">
        Solicitante: {nomeDe(usuarios, chamado.usuarioId)} | Setor: {nomeDe(setores, chamado.setorId)} |
        Categoria: {nomeDe(categorias, chamado.categoriaId)} |
        Equipamento: {chamado.equipamentoId ? nomeDe(equipamentos, chamado.equipamentoId) : 'nenhum'}
      </p>
      <p className="texto-pequeno">
        Aberto em {formatarDataHora(chamado.dataAbertura)} | Prazo: {formatarDataHora(prazoFinal(chamado, prazos))}
        {atrasado && <span className="texto-atrasado"> (fora do prazo)</span>}
      </p>
      <p className="texto-pequeno">
        Técnico responsável: {chamado.tecnicoId ? nomeDe(tecnicos, chamado.tecnicoId) : 'não atribuído'}
      </p>

      {chamado.solucao !== '' && (
        <p style={{ marginTop: '8px' }}><strong>Solução:</strong> {chamado.solucao}</p>
      )}

      {erro !== '' && <div className="erro">{erro}</div>}

      {/* Se está concluído, só pode reabrir. Senão, mostra as ações. */}
      {chamado.status === 'concluido' ? (
        <div className="bloco">
          {podeReabrir(chamado) ? (
            <button className="btn-secundario" onClick={reabrir}>Reabrir chamado</button>
          ) : (
            <p className="texto-pequeno">O prazo de 7 dias para reabrir este chamado já terminou.</p>
          )}
        </div>
      ) : (
        <div>
          <div className="bloco">
            <label>Atribuir técnico</label>
            <select value={tecnicoEscolhido} onChange={(e) => setTecnicoEscolhido(e.target.value)}>
              <option value="">
                {tecnicosHabilitados.length > 0 ? 'Selecione...' : 'Nenhum técnico habilitado nesta categoria'}
              </option>
              {tecnicosHabilitados.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
            <button className="btn-secundario" onClick={atribuir}>Atribuir</button>
          </div>

          <div className="bloco">
            <label>Mudar situação</label>
            <select value={novaSituacao} onChange={(e) => setNovaSituacao(e.target.value)}>
              {situacoes.map((s) => (
                <option key={s.valor} value={s.valor}>{s.texto}</option>
              ))}
            </select>
            <textarea
              rows="2"
              style={{ marginTop: '8px' }}
              placeholder={novaSituacao === 'concluido' ? 'Descreva a solução (obrigatório)' : 'Observação (opcional)'}
              value={textoSituacao}
              onChange={(e) => setTextoSituacao(e.target.value)}
            />
            <button className="btn-secundario" onClick={mudarSituacao}>Salvar situação</button>
          </div>

          <div className="bloco">
            <label>Adicionar comentário</label>
            <textarea rows="2" value={comentario} onChange={(e) => setComentario(e.target.value)} />
            <button className="btn-secundario" onClick={comentar}>Comentar</button>
          </div>
        </div>
      )}

      <div className="bloco">
        <label>Andamentos</label>
        {andamentos.map((a) => (
          <div key={a.id} className="andamento">
            <strong>{formatarDataHora(a.dataHora)}</strong>
            <span className={'badge status-' + a.status}>{nomeSituacao(a.status)}</span>
            <br />
            {a.comentario}
          </div>
        ))}
      </div>
    </div>
  );
}