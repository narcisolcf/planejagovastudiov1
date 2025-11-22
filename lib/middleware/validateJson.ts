import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

/**
 * Middleware para validar JSON em requisições POST/PUT/PATCH
 */
export function validateJsonMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Apenas para métodos que enviam JSON
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {

      // Verificar Content-Type
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(400).json({
          error: 'Tipo de conteúdo inválido',
          message: 'Content-Type deve ser application/json',
          statusCode: 400
        });
      }

      // Verificar se o body existe
      if (req.body === undefined || req.body === null) {
        return res.status(400).json({
          error: 'Requisição inválida',
          message: 'Corpo da requisição vazio ou JSON malformado',
          statusCode: 400
        });
      }

      // Verificar se não está vazio
      if (typeof req.body === 'object' && Object.keys(req.body).length === 0) {
        return res.status(400).json({
          error: 'Requisição inválida',
          message: 'Corpo da requisição não pode estar vazio',
          statusCode: 400
        });
      }
    }

    return handler(req, res);
  };
}
