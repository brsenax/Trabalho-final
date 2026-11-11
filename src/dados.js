// Cria uma data de "n dias atrás" (usado para testar chamado atrasado)
function diasAtras(n) {
  const data = new Date();
  data.setDate(data.getDate() - n);
  return data.toISOString();
}

export const setoresIniciais = [
  { id: 1, nome: 'Financeiro' },
  { id: 2, nome: 'Recursos Humanos' },
  { id: 3, nome: 'Recepção' },
];

export const usuariosIniciais = [
  { id: 1, nome: 'Ana Souza', telefone: '(82) 99999-0001' },
  { id: 2, nome: 'Carlos Lima', telefone: '(82) 99999-0002' },
];

export const categoriasIniciais = [
  { id: 1, nome: 'Informática' },
  { id: 2, nome: 'Elétrica' },
  { id: 3, nome: 'Hidráulica' },
];

// Cada equipamento pertence a um setor (setorId)
export const equipamentosIniciais = [
  { id: 1, nome: 'Impressora Laser Jet', setorId: 1 },
  { id: 2, nome: 'Computador PC-02', setorId: 2 },
  { id: 3, nome: 'Ar-condicionado Sala 1', setorId: 3 },
];

export const tecnicosIniciais = [
  { id: 1, nome: 'João Pereira', telefone: '(82) 98888-0001', cpf: '111.111.111-11' },
  { id: 2, nome: 'Marcos Silva', telefone: '(82) 98888-0002', cpf: '222.222.222-22' },
];

// Habilitação = liga Técnico com Categoria (relação N:N)
export const habilitacoesIniciais = [
  { id: 1, tecnicoId: 1, categoriaId: 1, nivel: 'Sênior', dataCertificado: '2024-05-10' },
  { id: 2, tecnicoId: 2, categoriaId: 2, nivel: 'Pleno', dataCertificado: '2023-03-15' },
  { id: 3, tecnicoId: 2, categoriaId: 3, nivel: 'Júnior', dataCertificado: '2025-01-20' },
];

// Prazo em dias para cada prioridade (dá para mudar na aba "Prazos")
export const prazosIniciais = { alta: 1, media: 3, baixa: 7 };

// Este chamado foi aberto há 2 dias com prioridade alta (prazo de 1 dia), então já nasce atrasado
export const chamadosIniciais = [
  {
    id: 1,
    descricao: 'Papel atolado e luz vermelha piscando.',
    prioridade: 'alta',
    status: 'aberto',
    dataAbertura: diasAtras(2),
    dataFechamento: null,
    solucao: '',
    usuarioId: 1,
    setorId: 1,
    categoriaId: 1,
    equipamentoId: 1,
    tecnicoId: null,
  },
];

export const andamentosIniciais = [
  { id: 1, chamadoId: 1, status: 'aberto', comentario: 'Chamado aberto.', dataHora: diasAtras(2) },
];