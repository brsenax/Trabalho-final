import { Request, Response } from 'express';

// Lista temporária em memória para chamados
const chamados = [
  { id: 1, descricao: 'Computador da sala 3 não liga', prioridade: 'Alta' }
];

export async function listarChamados(req: Request, res: Response) {
  return res.json(chamados);
}

export async function criarChamado(req: Request, res: Response) {
  const { descricao, prioridade } = req.body;
  
  const novoChamado = {
    id: chamados.length + 1,
    descricao,
    prioridade: prioridade || 'Normal'
  };

  chamados.push(novoChamado);
  return res.status(201).json({ mensagem: 'Chamado criado com sucesso!', chamado: novoChamado });
}