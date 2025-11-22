import { NextApiRequest, NextApiResponse } from 'next';
import { validateJsonMiddleware } from '@/lib/middleware/validateJson';
import { validarCriacaoPlano } from '@/lib/utils/validation';
import { Plano } from '@/lib/types/plano';

// Simular banco de dados (substituir por Supabase/Prisma depois)
let planos: Plano[] = [];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          error: 'Método não permitido',
          message: `O método ${req.method} não é permitido neste endpoint`,
          allowed: ['GET', 'POST'],
          statusCode: 405
        });
    }
  } catch (error) {
    console.error('Erro na API /planos:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      statusCode: 500
    });
  }
}

/**
 * GET /api/planos
 * Lista todos os planos
 */
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { busca, status } = req.query;

  let resultado = [...planos];

  // Filtrar por busca
  if (busca && typeof busca === 'string') {
    const termoBusca = busca.toLowerCase();
    resultado = resultado.filter(
      (p) =>
        p.nome.toLowerCase().includes(termoBusca) ||
        p.descricao.toLowerCase().includes(termoBusca)
    );
  }

  // Filtrar por status
  if (status && typeof status === 'string') {
    resultado = resultado.filter((p) => p.status === status);
  }

  return res.status(200).json({
    success: true,
    data: resultado,
    total: resultado.length,
    filtros: { busca, status }
  });
}

/**
 * POST /api/planos
 * Cria um novo plano
 */
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // Validar dados
  const validacao = validarCriacaoPlano(req.body);

  if (!validacao.valido) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Os dados fornecidos não são válidos',
      erros: validacao.erros,
      statusCode: 400
    });
  }

  const dados = validacao.dados!;

  // Verificar duplicatas
  const duplicado = planos.find(
    (p) => p.nome.toLowerCase() === dados.nome.toLowerCase()
  );

  if (duplicado) {
    return res.status(409).json({
      error: 'Conflito',
      message: 'Já existe um plano com este nome',
      plano_existente: {
        id: duplicado.id,
        nome: duplicado.nome
      },
      statusCode: 409
    });
  }

  // Criar novo plano
  const novoPlano: Plano = {
    id: `plano_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nome: dados.nome,
    descricao: dados.descricao,
    status: dados.status || 'rascunho',
    usuario_id: 'usuario_mock', // Substituir por autenticação real
    criado_em: new Date(),
    atualizado_em: new Date()
  };

  planos.push(novoPlano);

  return res.status(201).json({
    success: true,
    message: 'Plano criado com sucesso',
    data: novoPlano
  });
}

// Aplicar middleware
export default validateJsonMiddleware(handler);
