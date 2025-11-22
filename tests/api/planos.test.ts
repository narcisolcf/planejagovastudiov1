/**
 * Testes básicos para a API de Planos
 * Execute com: npm test
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('API /api/planos', () => {
  let planoId: string;

  // Teste 1: Listar planos (deve retornar array)
  test('GET /api/planos - deve listar planos', async () => {
    const response = await fetch(`${BASE_URL}/api/planos`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  // Teste 2: Criar plano com dados válidos
  test('POST /api/planos - deve criar plano', async () => {
    const novoPlano = {
      nome: 'Plano Teste ' + Date.now(),
      descricao: 'Descrição do plano de teste'
    };

    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPlano)
    });

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('id');
    expect(data.data.nome).toBe(novoPlano.nome);

    planoId = data.data.id;
  });

  // Teste 3: Criar plano duplicado (deve falhar)
  test('POST /api/planos - deve rejeitar duplicata', async () => {
    const plano = {
      nome: 'Plano Duplicado',
      descricao: 'Teste de duplicata'
    };

    // Primeira criação
    await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plano)
    });

    // Segunda criação (deve falhar)
    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plano)
    });

    expect(response.status).toBe(409);
  });

  // Teste 4: Criar plano com dados inválidos
  test('POST /api/planos - deve rejeitar dados inválidos', async () => {
    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: '' }) // Falta descrição
    });

    expect(response.status).toBe(400);
  });

  // Teste 5: Criar plano com JSON malformado
  test('POST /api/planos - deve rejeitar JSON malformado', async () => {
    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{'nome': 'invalido'}" // JSON malformado
    });

    expect(response.status).toBe(400);
  });

  // Teste 6: Buscar plano por ID
  test('GET /api/planos/:id - deve buscar plano', async () => {
    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.id).toBe(planoId);
  });

  // Teste 7: Atualizar plano
  test('PUT /api/planos/:id - deve atualizar plano', async () => {
    const atualizacao = {
      nome: 'Plano Atualizado'
    };

    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atualizacao)
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.nome).toBe(atualizacao.nome);
  });

  // Teste 8: Excluir plano
  test('DELETE /api/planos/:id - deve excluir plano', async () => {
    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`, {
      method: 'DELETE'
    });

    expect(response.status).toBe(204);
  });

  // Teste 9: Buscar plano excluído (deve retornar 404)
  test('GET /api/planos/:id - deve retornar 404 para plano excluído', async () => {
    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`);

    expect(response.status).toBe(404);
  });
});
