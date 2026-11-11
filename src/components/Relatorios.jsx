import { ListaChamados } from './ListaChamados';
import { estaAtrasado, diasEntre } from '../utils';

export function Relatorios({
  chamados, setores, categorias, equipamentos, tecnicos, prazos, onSelecionar,
}) {
  // 1) Tempo médio de atendimento por categoria (só conta chamados concluídos)
  const tempoPorCategoria = categorias.map((cat) => {
    const concluidos = chamados.filter(
      (c) => c.categoriaId === cat.id && c.status === 'concluido'
    );

    let soma = 0;
    concluidos.forEach((c) => {
      soma = soma + diasEntre(c.dataAbertura, c.dataFechamento);
    });

    let media = null;
    if (concluidos.length > 0) {
      media = soma / concluidos.length;
    }

    return { nome: cat.nome, quantidade: concluidos.length, media: media };
  });

  // 2) Equipamentos com mais chamados (do maior para o menor)
  const rankingEquipamentos = equipamentos
    .map((eq) => {
      const total = chamados.filter((c) => c.equipamentoId === eq.id).length;
      return { nome: eq.nome, quantidade: total };
    })
    .filter((eq) => eq.quantidade > 0)
    .sort((a, b) => b.quantidade - a.quantidade);

  // 3) Chamados fora do prazo
  const foraDoPrazo = chamados.filter((c) => estaAtrasado(c, prazos));

  return (
    <div>
      <div className="grid">
        <div className="card">
          <h2>Tempo médio de atendimento por categoria</h2>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Concluídos</th>
                <th>Média (dias)</th>
              </tr>
            </thead>
            <tbody>
              {tempoPorCategoria.map((item) => (
                <tr key={item.nome}>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.media === null ? '-' : item.media.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Equipamentos com mais chamados</h2>
          {rankingEquipamentos.length === 0 ? (
            <p className="texto-pequeno">Ainda não há chamados com equipamento.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Equipamento</th>
                  <th>Chamados</th>
                </tr>
              </thead>
              <tbody>
                {rankingEquipamentos.map((eq) => (
                  <tr key={eq.nome}>
                    <td>{eq.nome}</td>
                    <td>{eq.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ListaChamados
        titulo="Chamados fora do prazo"
        chamados={foraDoPrazo}
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