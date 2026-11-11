export function Prazos({ prazos, onAlterarPrazos }) {
  function alterar(prioridade, valor) {
    // Copia o objeto de prazos e troca só a prioridade que mudou
    onAlterarPrazos({ ...prazos, [prioridade]: Number(valor) });
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Prazos de atendimento (em dias)</h2>
      <p className="texto-pequeno" style={{ marginBottom: '15px' }}>
        O prazo de cada chamado depende da prioridade escolhida na abertura.
      </p>

      <div className="form-group">
        <label>Alta</label>
        <input type="number" min="1" value={prazos.alta} onChange={(e) => alterar('alta', e.target.value)} />
      </div>

      <div className="form-group">
        <label>Média</label>
        <input type="number" min="1" value={prazos.media} onChange={(e) => alterar('media', e.target.value)} />
      </div>

      <div className="form-group">
        <label>Baixa</label>
        <input type="number" min="1" value={prazos.baixa} onChange={(e) => alterar('baixa', e.target.value)} />
      </div>
    </div>
  );
}