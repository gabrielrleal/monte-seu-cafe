# Projeto Cafeteria - Desafio Prático QA

Este repositório contém a solução para o desafio prático do Processo Seletivo **01517/2025 - Analista de Qualidade Software - Pleno**: O projeto consiste em uma aplicação web de autoatendimento que permite a clientes de uma cafeteria personalizarem suas bebidas, selecionando ingredientes e recebendo um resumo dinâmico da sua criação

---

## 1. Instruções de Setup e Execução (RQNF10)

**Pré-requisitos:**
- Git
- Docker e Docker Compose

**Passos para Execução:**

1.  Clone este repositório para sua máquina local:
    ```bash
    git clone https://github.com/SENAI-SD/qa-pleno-01517-2025-087.420.254-00.git
    ```
2.  Navegue até a pasta raiz do projeto clonado.

3.  Execute o seguinte comando para construir as imagens e iniciar todos os containers:
    ```bash
    docker-compose up --build
    ```
4.  Aguarde até que os logs dos três serviços (`db`, `backend`, `frontend`) se estabilizem e indiquem que foram iniciados com sucesso.

5.  Acesse a aplicação no seu navegador:
    * **Frontend:** [http://localhost:3000](http://localhost:3000)

---

## 2. Tecnologias Utilizadas

- **Backend:** Java 17 com Spring Boot
- **Frontend:** TypeScript com React (Vite)
- **Banco de Dados:** PostgreSQL 
- **Migrations:** Flyway 
- **Testes Unitários (Backend):** JUnit 5 e Mockito 
- **Testes Automatizados (E2E & API):** Playwright 
- **Containerização:** Docker e Docker Compose 

---

## 3. Plano de Testes (RQNF14, RQNF15, RQNF16)

A estratégia de testes adotada para o projeto foi a de **Múltiplas Camadas (Pirâmide de Testes)**, com o objetivo de garantir a qualidade em diferentes níveis da aplicação com o melhor custo-benefício de tempo e esforço.

**Prioridades a Curto Prazo:**
A prioridade foi garantir 100% de cobertura das regras de negócio críticas através de testes de unidade e validar o fluxo principal do usuário com um teste E2E.

### 3.1. Testes de Unidade (Caixa-Branca) 
* **Ferramentas:** JUnit 5 e Mockito.
* **Objetivo:** Validar a lógica de negócio na classe `CafeteriaService` de forma isolada, sem dependência do banco de dados. Esta é a base da pirâmide, garantindo que os cálculos e regras estão corretos.
* **Cenários Cobertos:** Validação dos limites de ingredientes, identificação de receitas clássicas, identificação de cafés personalizados e geração do nome final da bebida.

### 3.2. Testes de API (Caixa-Preta) 
* **Ferramenta:** Playwright.
* **Objetivo:** Validar o "contrato" da API do backend, garantindo que os endpoints respondem com o status HTTP correto e com a estrutura de dados (schema) esperada em formato JSON.
* **Cenários Cobertos:** Teste do endpoint `GET /api/cafeteria/ingredientes` para verificar a estrutura da resposta.

### 3.3. Testes End-to-End (E2E) (Caixa-Preta) 
* **Ferramenta:** Playwright.
* **Objetivo:** Simular a jornada completa de um usuário na interface gráfica, validando a integração entre o frontend, backend e banco de dados.
* **Cenários Cobertos:** Fluxo completo de montagem de um café, desde a seleção da base, adição de extras, confirmação de etapas, até a visualização da tela de sucesso.
### 3.4. Testes de Acessibilidade (Verificação Adicional)

Como iniciativa extra para garantir a `Qualidade da usabilidade para o usuário final`, foi realizada uma verificação automatizada de acessibilidade na interface do frontend utilizando a ferramenta **Accessibility Insights for Web**.

* **Objetivo:** Identificar problemas comuns de acessibilidade que podem dificultar o uso da aplicação por pessoas com deficiências visuais.
* **Resultado Principal:** A ferramenta identificou **8 instâncias de falha de contraste de cores**, violando as diretrizes WCAG 2 AA. O principal problema encontrado foi o contraste entre o texto branco dos botões selecionados (`#FFFFFF`) e o fundo azul claro (`#3498db`), que pode ser de difícil leitura para usuários com baixa visão.
* **Ação Recomendada (Melhoria Futura):** Para uma próxima versão, recomenda-se ajustar a paleta de cores da aplicação, escurecendo o tom de azul ou alterando a cor do texto para garantir um nível de contraste que atenda aos padrões internacionais de acessibilidade.
---

## 4. Especificações Gherkin (RQNF13)

Abaixo estão exemplos de especificações de comportamento para as funcionalidades centrais.

**Funcionalidade:** Montagem de Café

**Cenário 1: Cliente monta um café clássico com adicionais**
```gherkin
Dado que o cliente está na tela de montagem de café
Quando ele seleciona os ingredientes base "Expresso" e "Leite"
E clica em "Confirmar Base e ir para Adicionais"
E então seleciona o adicional "Caramelo"
E clica em "Revisar Pedido"
Então o resumo deve exibir o nome "Latte com Caramelo"
```

**Cenário 2: Cliente tenta exceder o limite de ingredientes base**
```gherkin
 Sistema impede a seleção de mais de 3 ingredientes base
  Dado que o cliente está na tela de montagem de café
  E ele já selecionou "Expresso", "Leite" e "Chocolate"
  Então os botões para os outros ingredientes base (como "Sorvete") devem estar desabilitados
  E o cliente é impedido de selecionar um quarto ingrediente base
```

---

## 5. Segurança de Acesso ao Backend (RQNF4)

Para atender ao requisito de bloquear o acesso público direto ao backend, a arquitetura foi desenhada de forma que apenas o container do frontend possa se comunicar com o container do backend.

Isto foi alcançado através da rede interna privada criada pelo Docker Compose. O container do `backend` não tem sua porta `8080` publicada diretamente. Em vez disso, o container do `frontend`, que utiliza um servidor web Nginx, atua como um **reverse proxy**. Qualquer requisição do usuário para a API (ex: `/api/...`) é primeiro recebida pelo Nginx, que então a encaminha internamente para o serviço `backend`, protegendo-o de exposição direta.

---

## 6. Autoavaliação de Código e Possíveis Melhorias (RQNF11)

### Autoavaliação
* **Arquitetura Robusta:** A aplicação foi estruturada com uma clara separação de responsabilidades no backend (camadas de Controller, Service, Repository) e containerizada com Docker, garantindo portabilidade e um ambiente de execução consistente.
* **Qualidade via Testes:** A estratégia de testes em múltiplas camadas (Unitário, API, E2E) assegura a qualidade da lógica de negócio isolada e da integração do sistema como um todo.
* **Durante o desenvolvimento sob um prazo limitado, foram feitas escolhas pragmáticas que resultaram em algumas dívidas técnicas. 

### Pontos a Melhorar e Próximos Passos
* **Componentização do Frontend:** Para um projeto real e de longo prazo, o componente `App.tsx` seria refatorado em componentes de UI menores e mais especializados (`<Stepper/>`, `<IngredientSelector/>`, `<SummaryCard/>`) para aumentar ainda mais a legibilidade e a reutilização de código. Optei por manter a estrutura atual para focar na entrega dos requisitos funcionais e de teste dentro do prazo.
* **Modelagem de Receitas:** A implementação atual com as receitas no banco de dados é flexível. O próximo passo seria criar uma interface de administração para que um gerente de produto pudesse adicionar ou alterar receitas sem a necessidade de novas migrations ou deploy do código.
* **Tratamento de Erros:** O tratamento de erros no backend poderia ser aprimorado com um `@ControllerAdvice` global para capturar exceções de forma centralizada e retornar respostas de erro padronizadas.
* **Segurança da Aplicação (Defesa em Profundidade):** A arquitetura atual atende ao requisito `RQNF4` ao proteger o backend da exposição pública através da rede Docker e do reverse proxy no frontend. Contudo, para um ambiente de produção, a segurança intrínseca da aplicação deveria ser implementada. Uma evolução essencial seria adicionar o **Spring Security** ao backend para proteger os endpoints da API, exigindo autenticação (ex: via API Key ou tokens JWT). Isso garantiria que, mesmo que a rede interna fosse acessada, apenas clientes autorizados poderiam interagir com os dados, seguindo o princípio de 'defesa em profundidade'.
* **Criação de Painel Administrativo com Controle de Acesso (RBAC):** Para tornar o sistema verdadeiramente gerenciável, o próximo passo seria desenvolver um painel de administração. Este painel permitiria o cadastro de novos ingredientes e receitas diretamente pela interface. Para proteger esta área, seria implementado um sistema de controle de acesso baseado em funções (Role-Based Access Control - RBAC) com o Spring Security. Usuários com a função `ROLE_ADMIN` teriam acesso a estas funcionalidades de cadastro, enquanto a API pública para os clientes permaneceria com acesso anônimo, garantindo a flexibilidade e a segurança da aplicação.

 * **Acessibilidade e HTML Semântico:** Embora uma verificação automatizada tenha sido realizada (identificando falhas de contraste), a base da acessibilidade de uma aplicação web reside na utilização de HTML semântico. A implementação atual utiliza tags como `<div>`, `<section>` e `<aside>`. Uma melhoria crucial para o futuro seria refatorar o JSX para utilizar tags semânticas de forma ainda mais específica, garantindo que a estrutura da página seja perfeitamente interpretada por leitores de tela e outras tecnologias assistivas, provendo uma experiência mais rica e inclusiva para pessoas com deficiência.

---


## Relatório de Bug Manual (RQNF17)

Durante a revisão do código-fonte e testes funcionais manuais, foi identificado o seguinte bug na lógica de validação do frontend:

* **Título:** O código para exibir a mensagem de erro de limite de ingredientes é inalcançável (código morto).

* **Análise da Causa Raiz:**
    A interface do usuário impede proativamente que o cliente selecione mais de 3 ingredientes base (ou 2 adicionais) ao desabilitar os botões restantes com a propriedade `disabled` do React. A lógica é:
    `disabled={!selectedBaseIds.has(ing.id) && selectedBaseIds.size >= 3}`
    
    No entanto, a função `handleSelectBase` ainda contém um bloco de código `else` projetado para lidar com a tentativa de selecionar um quarto ingrediente e exibir uma mensagem de erro:
    ```javascript
    else { 
        setError('Máximo de 3 ingredientes base.'); 
        setTimeout(() => setError(''), 3000); 
    }
    ```
    Como o botão já está desabilitado, o evento `onClick` que chama `handleSelectBase` nunca pode ser disparado em uma condição que ativaria este bloco `else`.

* **Resultado Esperado:**
    Quando o usuário tenta uma ação inválida (como clicar em um quarto ingrediente), um feedback de erro claro deveria ser fornecido.

* **Resultado Obtido:**
    A ação inválida é corretamente prevenida (o que é bom), mas o código específico para o feedback de erro nunca é executado, tornando-o um "código morto". Isso indica uma inconsistência entre a lógica de prevenção da UI e a lógica de tratamento de erro.

* **Sugestão de Correção:**
    Remover o bloco `else` inalcançável do código para limpá-lo, ou, alternativamente, remover a lógica de `disabled` dos botões e confiar apenas no tratamento de erro dentro da função `handleSelectBase` para fornecer o feedback ao usuário, garantindo que a mensagem de erro seja de fato exibida.


---

## 8. Requisitos Não Atendidos (RQNF18)

Todos os requisitos **indispensáveis** do desafio foram atendidos.

Os seguintes requisitos, marcados como opcional ou diferencial no documento, não foram implementados para priorizar a qualidade da entrega e a cobertura de testes dos itens obrigatórios dentro do prazo estipulado:

* **RN005.4 (Opcional):** Cálculo e exibição do preço total do café.
* **RQNF12 (Diferencial):** Análise estática de código e geração de relatório com a ferramenta SonarQube.
