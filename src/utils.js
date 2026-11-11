// As situações possíveis do chamado
export const situacoes = [
  { valor: 'aberto', texto: 'Aberto' },
  { valor: 'em_atendimento', texto: 'Em atendimento' },
  { valor: 'aguardando_peca', texto: 'Aguardando peça' },
  { valor: 'concluido', texto: 'Concluído' },
];

// Recebe o valor ('em_atendimento') e devolve o texto bonito ('Em atendimento')
export function nomeSituacao(valor) {
  const situacao = situacoes.find((s) => s.valor === valor);
  return situacao.texto;
}

// Gera um id novo a cada chamada (100, 101, 102...). O banco de dados faria isso no futuro.
let ultimoId = 100;
export function novoId() {
  ultimoId = ultimoId + 1;
  return ultimoId;
}

// Procura um item na lista pelo id e devolve o nome dele
export function nomeDe(lista, id) {
  const item = lista.find((i) => i.id === id);
  if (item) {
    return item.nome;
  }
  return '-';
}

// REGRA: prazo final = data de abertura + dias da prioridade
export function prazoFinal(chamado, prazos) {
  const dias = prazos[chamado.prioridade]; // ex.: prazos['alta'] -> 1
  const data = new Date(chamado.dataAbertura);
  data.setDate(data.getDate() + dias);
  return data;
}

// Chamado fora do prazo? Compara o prazo com a data de fechamento (ou com "agora" se ainda está aberto)
export function estaAtrasado(chamado, prazos) {
  let referencia = new Date();
  if (chamado.dataFechamento) {
    referencia = new Date(chamado.dataFechamento);
  }
  return referencia > prazoFinal(chamado, prazos);
}

// REGRA: técnico só pode atender categorias em que está habilitado
export function tecnicoHabilitado(tecnicoId, categoriaId, habilitacoes) {
  return habilitacoes.some(
    (h) => h.tecnicoId === tecnicoId && h.categoriaId === categoriaId
  );
}

// Quantos dias se passaram entre duas datas
export function diasEntre(inicio, fim) {
  const milissegundos = new Date(fim) - new Date(inicio);
  return milissegundos / (1000 * 60 * 60 * 24);
}

// REGRA: o solicitante pode reabrir em até 7 dias depois de concluído
export function podeReabrir(chamado) {
  if (chamado.status !== 'concluido') {
    return false;
  }
  return diasEntre(chamado.dataFechamento, new Date()) <= 7;
}

export function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

export function formatarDataHora(data) {
  return new Date(data).toLocaleString('pt-BR');
}

// Devolve só o dia no formato AAAA-MM-DD (o mesmo formato do campo de data do HTML)
export function soDia(data) {
  return new Date(data).toLocaleDateString('en-CA');
}