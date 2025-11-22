import { CriarPlanoDTO, AtualizarPlanoDTO } from '../types/plano';

/**
 * Valida os dados para criação de um plano
 */
export function validarCriacaoPlano(dados: any): {
  valido: boolean;
  erros: string[];
  dados?: CriarPlanoDTO;
} {
  const erros: string[] = [];

  // Validar nome
  if (!dados.nome) {
    erros.push('O campo "nome" é obrigatório');
  } else if (typeof dados.nome !== 'string') {
    erros.push('O campo "nome" deve ser uma string');
  } else if (dados.nome.trim().length === 0) {
    erros.push('O campo "nome" não pode estar vazio');
  } else if (dados.nome.length > 200) {
    erros.push('O campo "nome" não pode exceder 200 caracteres');
  }

  // Validar descrição
  if (!dados.descricao) {
    erros.push('O campo "descricao" é obrigatório');
  } else if (typeof dados.descricao !== 'string') {
    erros.push('O campo "descricao" deve ser uma string');
  } else if (dados.descricao.trim().length === 0) {
    erros.push('O campo "descricao" não pode estar vazio');
  } else if (dados.descricao.length > 10000) {
    erros.push('O campo "descricao" não pode exceder 10.000 caracteres');
  }

  // Validar status (opcional)
  if (dados.status && !['rascunho', 'ativo'].includes(dados.status)) {
    erros.push('O campo "status" deve ser "rascunho" ou "ativo"');
  }

  if (erros.length > 0) {
    return { valido: false, erros };
  }

  return {
    valido: true,
    erros: [],
    dados: {
      nome: dados.nome.trim(),
      descricao: dados.descricao.trim(),
      status: dados.status || 'rascunho'
    }
  };
}

/**
 * Valida os dados para atualização de um plano
 */
export function validarAtualizacaoPlano(dados: any): {
  valido: boolean;
  erros: string[];
  dados?: AtualizarPlanoDTO;
} {
  const erros: string[] = [];

  // Pelo menos um campo deve ser fornecido
  if (!dados.nome && !dados.descricao && !dados.status) {
    erros.push('Pelo menos um campo deve ser fornecido para atualização');
  }

  // Validar nome (se fornecido)
  if (dados.nome !== undefined) {
    if (typeof dados.nome !== 'string') {
      erros.push('O campo "nome" deve ser uma string');
    } else if (dados.nome.trim().length === 0) {
      erros.push('O campo "nome" não pode estar vazio');
    } else if (dados.nome.length > 200) {
      erros.push('O campo "nome" não pode exceder 200 caracteres');
    }
  }

  // Validar descrição (se fornecida)
  if (dados.descricao !== undefined) {
    if (typeof dados.descricao !== 'string') {
      erros.push('O campo "descricao" deve ser uma string');
    } else if (dados.descricao.trim().length === 0) {
      erros.push('O campo "descricao" não pode estar vazio');
    } else if (dados.descricao.length > 10000) {
      erros.push('O campo "descricao" não pode exceder 10.000 caracteres');
    }
  }

  // Validar status (se fornecido)
  if (dados.status && !['rascunho', 'ativo', 'concluido', 'arquivado'].includes(dados.status)) {
    erros.push('O campo "status" é inválido');
  }

  if (erros.length > 0) {
    return { valido: false, erros };
  }

  const dadosAtualizacao: AtualizarPlanoDTO = {};
  if (dados.nome) dadosAtualizacao.nome = dados.nome.trim();
  if (dados.descricao) dadosAtualizacao.descricao = dados.descricao.trim();
  if (dados.status) dadosAtualizacao.status = dados.status;

  return {
    valido: true,
    erros: [],
    dados: dadosAtualizacao
  };
}

/**
 * Valida se um ID é válido
 */
export function validarId(id: any): boolean {
  return typeof id === 'string' && id.length > 0;
}
