import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080/api/cafeteria';

test.describe('Testes de API para o Backend da Cafeteria', () => {

  test('GET /ingredientes deve retornar status 200 e a lista de ingredientes', async ({ request }) => {
    
    // 1. Faz a chamada GET direta para o endpoint
    const response = await request.get(`${API_URL}/ingredientes`);

    // 2. Verifica se a resposta foi um sucesso (status 200 OK)
    expect(response.status()).toBe(200);

    // 3. Converte o corpo da resposta para JSON
    const body = await response.json();

    // 4. Faz as validações no JSON recebido
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const primeiroIngrediente = body[0];
    expect(primeiroIngrediente).toHaveProperty('id');
    expect(primeiroIngrediente).toHaveProperty('nome');
    expect(primeiroIngrediente).toHaveProperty('tipo');
  });

  test('POST /montar deve retornar status 200 e o café montado corretamente', async ({ request }) => {
    
    // 1. Define o corpo da requisição (payload)
    const requestBody = {
      idsIngredientesBase: [1, 2], // Expresso e Leite
      idsIngredientesAdicionais: [6]  // Caramelo
    };

    // 2. Faz a chamada POST direta para o endpoint
    const response = await request.post(`${API_URL}/montar`, {
      data: requestBody
    });

    // 3. Verifica se a resposta foi um sucesso
    expect(response.status()).toBe(200);

    // 4. Converte a resposta para JSON
    const body = await response.json();

    // 5. Valida o conteúdo da resposta
    expect(body.nomeFinal).toBe('Latte com Caramelo');
    expect(body.ingredientesBase).toEqual(['Expresso', 'Leite']);
    expect(body.ingredientesAdicionais).toEqual(['Caramelo']);
  });

});