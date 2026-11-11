import { useState } from 'react';

import { FormChamado } from './components/FormChamado';
import { ListaChamados } from './components/ListaChamados';
import { DetalheChamado } from './components/DetalheChamado';
import { Consulta } from './components/Consulta';
import { Equipamentos } from './components/Equipamentos';
import { Tecnicos } from './components/Tecnicos';
import { Relatorios } from './components/Relatorios';
import { Prazos } from './components/Prazos';

import {
  setoresIniciais, usuariosIniciais, categoriasIniciais, equipamentosIniciais,
  tecnicosIniciais, habilitacoesIniciais, prazosIniciais, chamadosIniciais, andamentosIniciais,
} from './dados';
import { nomeSituacao, novoId, nomeDe, tecnicoHabilitado, podeReabrir } from './utils';

// Abas do menu
const abas = [
  { id: 'chamados', texto: 'Chamados' },
  { id: 'consulta', texto: 'Consultar' },
  { id: 'equipamentos', texto: 'Equipamentos' },
  { id: 'tecnicos', texto: 'Técnicos' },
  { id: 'relatorios', texto: 'Relatórios' },
  { id: 'prazos', texto: 'Prazos' },
];

export default function App() {
  // ---------- ESTADOS: os dados que, ao mudar, atualizam a tela ----------
  const [abaAtual, setAbaAtual] = useState('chamados');
  const [chamadoSelecionadoId, setChamadoSelecionadoId] = useState(null);

  // Estes três não mudam nesta versão, por isso não precisam de "set"
  const [setores] = useState(setoresIniciais);
  const [usuarios] = useState(usuariosIniciais);
  const [categorias] = useState(categoriasIniciais);

  const [equipamentos, setEquipamentos] = useState(equipamentosIniciais);
  const [tecnicos, setTecnicos] = useState(tecnicosIniciais);
  const [habilitacoes, setHabilitacoes] = useState(habilitacoesIniciais);
  const [chamados, setChamados] = useState(chamadosIniciais);
  const [andamentos, setAndamentos] = useState(andamentosIniciais);
  const [prazos, setPrazos] = useState(prazosIniciais);

  // ---------- ANDAMENTO ----------
  // REGRA: toda mudança gera um registro de andamento
  function registrarAndamento(chamadoId, status, comentario) {
    const novo = {
      id: novoId(),
      chamadoId: chamadoId,
      status: status,
      comentario: comentario,
      dataHora: new Date().toISOString(),
    };
    setAndamentos([...andamentos, novo]);
  }

  // Troca só os campos informados de UM chamado e mantém os outros iguais
  function atualizarChamado(id, alteracoes) {
    const listaNova = chamados.map((c) => {
      if (c.id === id) {
        return { ...c, ...alteracoes };
      }
      return c;
    });
    setChamados(listaNova);
  }

  // ---------- FUNCIONALIDADE 1: abrir chamado ----------
  function abrirChamado(dados) {
    const id = novoId();
    const novo = {
      ...dados, // usuarioId, setorId, categoriaId, equipamentoId, prioridade, descricao
      id: id,
      status: 'aberto',
      dataAbertura: new Date().toISOString(),
      dataFechamento: null,
      solucao: '',
      tecnicoId: null,
    };
    setChamados([novo, ...chamados]);
    registrarAndamento(id, 'aberto', 'Chamado aberto.');
  }

  // ---------- FUNCIONALIDADE 2: atribuir técnico ----------
  function atribuirTecnico(chamadoId, tecnicoId) {
    const chamado = chamados.find((c) => c.id === chamadoId);

    // REGRA: só técnico habilitado na categoria do chamado
    if (!tecnicoHabilitado(tecnicoId, chamado.categoriaId, habilitacoes)) {
      return 'Este técnico não é habilitado na categoria do chamado.';
    }

    atualizarChamado(chamadoId, { tecnicoId: tecnicoId });
    registrarAndamento(
      chamadoId,
      chamado.status,
      'Chamado atribuído ao técnico ' + nomeDe(tecnicos, tecnicoId) + '.'
    );
    return '';
  }

  // ---------- FUNCIONALIDADE 3: mudar situação e comentar ----------
  function mudarSituacao(chamadoId, novaSituacao, texto) {
    const chamado = chamados.find((c) => c.id === chamadoId);

    if (novaSituacao === chamado.status) {
      return 'O chamado já está nessa situação.';
    }

    // REGRA: para concluir é obrigatório descrever a solução
    if (novaSituacao === 'concluido' && texto.trim() === '') {
      return 'Para concluir o chamado, descreva a solução aplicada.';
    }

    if (novaSituacao === 'concluido') {
      atualizarChamado(chamadoId, {
        status: 'concluido',
        dataFechamento: new Date().toISOString(),
        solucao: texto.trim(),
      });
    } else {
      atualizarChamado(chamadoId, { status: novaSituacao, dataFechamento: null });
    }

    // REGRA: mudança de situação gera andamento automaticamente
    let mensagem =
      'Situação alterada de "' + nomeSituacao(chamado.status) +
      '" para "' + nomeSituacao(novaSituacao) + '".';
    if (texto.trim() !== '') {
      mensagem = mensagem + ' ' + texto.trim();
    }
    registrarAndamento(chamadoId, novaSituacao, mensagem);
    return '';
  }

  function adicionarComentario(chamadoId, texto) {
    if (texto.trim() === '') {
      return 'Escreva um comentário.';
    }
    const chamado = chamados.find((c) => c.id === chamadoId);
    registrarAndamento(chamadoId, chamado.status, texto.trim());
    return '';
  }

  // REGRA: o solicitante pode reabrir em até 7 dias
  function reabrirChamado(chamadoId) {
    const chamado = chamados.find((c) => c.id === chamadoId);
    if (!podeReabrir(chamado)) {
      return 'O prazo de 7 dias para reabrir este chamado já passou.';
    }
    atualizarChamado(chamadoId, { status: 'aberto', dataFechamento: null });
    registrarAndamento(chamadoId, 'aberto', 'Chamado reaberto pelo solicitante.');
    return '';
  }

  // ---------- CADASTROS ----------
  function cadastrarEquipamento(dados) {
    const novo = { id: novoId(), nome: dados.nome, setorId: dados.setorId };
    setEquipamentos([...equipamentos, novo]);
  }

  function cadastrarTecnico(dados, categoriasIds, nivel) {
    const id = novoId();
    setTecnicos([...tecnicos, { id: id, ...dados }]);

    // Para cada categoria marcada, cria uma Habilitação
    const novasHabilitacoes = categoriasIds.map((categoriaId) => {
      return {
        id: novoId(),
        tecnicoId: id,
        categoriaId: categoriaId,
        nivel: nivel,
        dataCertificado: new Date().toISOString().slice(0, 10),
      };
    });
    setHabilitacoes([...habilitacoes, ...novasHabilitacoes]);
  }

  // ---------- O QUE APARECE NA TELA ----------
  const chamadoSelecionado = chamados.find((c) => c.id === chamadoSelecionadoId);

  return (
    <div className="container">
      <h1>Central de Chamados de Manutenção</h1>

      <div className="menu">
        {abas.map((aba) => (
          <button
            key={aba.id}
            className={abaAtual === aba.id ? 'ativa' : ''}
            onClick={() => setAbaAtual(aba.id)}
          >
            {aba.texto}
          </button>
        ))}
      </div>

      {/* Detalhes do chamado: só aparece se algum chamado foi selecionado */}
      {chamadoSelecionado && (
        <DetalheChamado
          key={chamadoSelecionado.id}
          chamado={chamadoSelecionado}
          andamentos={andamentos.filter((a) => a.chamadoId === chamadoSelecionado.id)}
          setores={setores}
          categorias={categorias}
          equipamentos={equipamentos}
          tecnicos={tecnicos}
          usuarios={usuarios}
          habilitacoes={habilitacoes}
          prazos={prazos}
          onFechar={() => setChamadoSelecionadoId(null)}
          onAtribuir={atribuirTecnico}
          onMudarSituacao={mudarSituacao}
          onComentar={adicionarComentario}
          onReabrir={reabrirChamado}
        />
      )}

      {abaAtual === 'chamados' && (
        <div className="grid">
          <FormChamado
            usuarios={usuarios}
            setores={setores}
            categorias={categorias}
            equipamentos={equipamentos}
            onAbrirChamado={abrirChamado}
          />
          <ListaChamados
            titulo="Chamados em andamento"
            chamados={chamados.filter((c) => c.status !== 'concluido')}
            setores={setores}
            categorias={categorias}
            equipamentos={equipamentos}
            tecnicos={tecnicos}
            prazos={prazos}
            onSelecionar={setChamadoSelecionadoId}
          />
        </div>
      )}

      {abaAtual === 'consulta' && (
        <Consulta
          chamados={chamados}
          setores={setores}
          categorias={categorias}
          equipamentos={equipamentos}
          tecnicos={tecnicos}
          prazos={prazos}
          onSelecionar={setChamadoSelecionadoId}
        />
      )}

      {abaAtual === 'equipamentos' && (
        <Equipamentos
          equipamentos={equipamentos}
          setores={setores}
          onCadastrar={cadastrarEquipamento}
        />
      )}

      {abaAtual === 'tecnicos' && (
        <Tecnicos
          tecnicos={tecnicos}
          categorias={categorias}
          habilitacoes={habilitacoes}
          onCadastrar={cadastrarTecnico}
        />
      )}

      {abaAtual === 'relatorios' && (
        <Relatorios
          chamados={chamados}
          setores={setores}
          categorias={categorias}
          equipamentos={equipamentos}
          tecnicos={tecnicos}
          prazos={prazos}
          onSelecionar={setChamadoSelecionadoId}
        />
      )}

      {abaAtual === 'prazos' && <Prazos prazos={prazos} onAlterarPrazos={setPrazos} />}
    </div>
  );
}