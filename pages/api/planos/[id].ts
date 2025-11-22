import { NextApiRequest, NextApiResponse } from 'next';
import { validateJsonMiddleware } from '@/lib/middleware/validateJson';
import { validarAtualizacaoPlano, validarId } from '@/lib/utils/validation';
import { Plano } from '@/lib/types/plano';

// Simular banco de dados (compartilhado com index.ts)
// Em produção, usar Supabase ou outro banco
let planos: Plano[] = [];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validar ID
  if (!validarId(id)) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'O parâmetro "id" deve ser uma string não vazia',
      statusCode: 400
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(id as string, req, res);
      case 'PUT':
        return handlePut(id as string, req, res);
      case 'DELETE':
        return handleDelete(id as string, req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({
          error: 'Método não permitido',
          message: `O método ${req.method} não é permitido neste endpoint`,
          allowed: ['GET', 'PUT', 'DELETE'],
          statusCode: 405
        });
    }
  } catch (error) {
    console.error(`Erro na API /planos/${id}:`, error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      statusCode: 500
    });
  }
}

/**
 * GET /api/planos/:id
 * Busca um plano específico
 */
function handleGet(id: string, req: NextApiRequest, res: NextApiResponse) {
  const plano = planos.find((p) => p.id === id);

  if (!plano) {
    return res.status(404).json({
      error: 'Não encontrado',
      message: `Plano com ID "${id}" não foi encontrado`,
      statusCode: 404
    });
  }

  return res.status(200).json({
    success: true,
    data: plano
  });
}

/**
 * PUT /api/planos/:id
 * Atualiza um plano existente
 */
function handlePut(id: string, req: NextApiRequest, res: NextApiResponse) {
  // Validar dados
  const validacao = validarAtualizacaoPlano(req.body);

  if (!validacao.valido) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Os dados fornecidos não são válidos',
      erros: validacao.erros,
      statusCode: 400
    });
  }

  // Buscar plano
  const indice = planos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({
      error: 'Não encontrado',
      message: `Plano com ID "${id}" não foi encontrado`,
      statusCode: 404
    });
  }

  const dados = validacao.dados!;

  // Verificar duplicata de nome (se estiver mudando o nome)
  if (dados.nome) {
    const duplicado = planos.find(
      (p) => p.id !== id && p.nome.toLowerCase() === dados.nome!.toLowerCase()
    );

    if (duplicado) {
      return res.status(409).json({
        error: 'Conflito',
        message: 'Já existe outro plano com este nome',
        plano_existente: {
          id: duplicado.id,
          nome: duplicado.nome
        },
        statusCode: 409
      });
    }
  }

  // Atualizar plano
  planos[indice] = {
    ...planos[indice],
    ...dados,
    atualizado_em: new Date()
  };

  return res.status(200).json({
    success: true,
    message: 'Plano atualizado com sucesso',
    data: planos[indice]
  });
}

/**
 * DELETE /api/planos/:id
 * Exclui um plano
 */
function handleDelete(id: string, req: NextApiRequest, res: NextApiResponse) {
  const indice = planos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({
      error: 'Não encontrado',
      message: `Plano com ID "${id}" não foi encontrado`,
      statusCode: 404
    });
  }

  // Remover plano
  planos.splice(indice, 1);

  // 204 No Content não deve retornar body
  return res.status(204).end();
}

// Aplicar middleware
export default validateJsonMiddleware(handler);
