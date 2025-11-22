/**
 * Interface para um Plano Governamental
 */
export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  status: 'rascunho' | 'ativo' | 'concluido' | 'arquivado';
  usuario_id: string;
  criado_em: Date;
  atualizado_em: Date;
}

/**
 * Dados para criação de um novo plano
 */
export interface CriarPlanoDTO {
  nome: string;
  descricao: string;
  status?: 'rascunho' | 'ativo';
}

/**
 * Dados para atualização de um plano
 */
export interface AtualizarPlanoDTO {
  nome?: string;
  descricao?: string;
  status?: 'rascunho' | 'ativo' | 'concluido' | 'arquivado';
}

/**
 * Resposta padrão de erro da API
 */
export interface ApiError {
  error: string;
  message: string;
  field?: string;
  statusCode: number;
}

/**
 * Resposta padrão de sucesso da API
 */
export interface ApiSuccess<T = any> {
  success: true;
  message?: string;
  data: T;
}
