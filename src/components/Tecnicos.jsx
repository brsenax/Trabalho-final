import { useState } from 'react';
import { nomeDe } from '../utils';

export function Tecnicos({ tecnicos, categorias, habilitacoes, onCadastrar }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [nivel, setNivel] = useState('Júnior');
  const [categoriasMarcadas, setCategoriasMarcadas] = useState([]); // lista de ids marcados

  // Marca ou desmarca uma categoria
  function alternarCategoria(id) {
    if (categoriasMarcadas.includes(id)) {
      // já estava marcada: tira da lista
      setCategoriasMarcadas(categoriasMarcadas.filter((c) => c !== id));
    } else {
      // não estava: coloca na lista
      setCategoriasMarcadas([...categoriasMarcadas, id]);
    }
  }

  function enviar(evento) {
    evento.preventDefault();
    onCadastrar({ nome: nome.trim(), telefone: telefone, cpf: cpf }, categoriasMarcadas, nivel);
    setNome('');
    setTelefone('');
    setCpf('');
    setNivel('Júnior');
    setCategoriasMarcadas([]);
  }

  // Monta um texto como "Informática, Elétrica" com as categorias do técnico
  function categoriasDoTecnico(tecnicoId) {
    const nomes = habilitacoes
      .filter((h) => h.tecnicoId === tecnicoId)
      .map((h) => nomeDe(categorias, h.categoriaId));

    if (nomes.length === 0) {
      return 'Nenhuma';
    }
    return nomes.join(', ');
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Novo técnico</h2>
        <form onSubmit={enviar}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>

          <div className="form-group">
            <label>CPF</label>
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Nível da habilitação</label>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option>Júnior</option>
              <option>Pleno</option>
              <option>Sênior</option>
            </select>
          </div>

          <div className="form-group">
            <label>Categorias em que é habilitado</label>
            {categorias.map((c) => (
              <div key={c.id}>
                <input
                  type="checkbox"
                  checked={categoriasMarcadas.includes(c.id)}
                  onChange={() => alternarCategoria(c.id)}
                />
                {c.nome}
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary">Cadastrar</button>
        </form>
      </div>

      <div className="card">
        <h2>Técnicos cadastrados ({tecnicos.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Habilitado em</th>
            </tr>
          </thead>
          <tbody>
            {tecnicos.map((t) => (
              <tr key={t.id}>
                <td>{t.nome}</td>
                <td>{t.cpf}</td>
                <td>{categoriasDoTecnico(t.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}