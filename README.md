# Foody Order Tracker

Sistema full-stack para gerenciamento e rastreamento de pedidos de delivery, desenvolvido como desafio técnico para a vaga de Desenvolvedor Full-Stack Pleno da Foody Delivery.

A aplicação representa um painel operacional interno no qual usuários autenticados podem cadastrar, consultar e acompanhar pedidos, além de atualizar seus status durante o fluxo de entrega.

O projeto foi desenvolvido buscando manter um escopo compatível com o desafio, mas adotando práticas próximas às utilizadas em aplicações reais.

---

## Funcionalidades

### Autenticação

- Cadastro de operador com nome, e-mail e senha
- Login com e-mail e senha
- Logout com invalidação da sessão
- Recuperação do usuário autenticado
- Rotas protegidas no frontend
- Persistência das sessões no PostgreSQL
- Cookies `HTTPOnly`
- Proteção contra CSRF
- Controle de CORS

### Pedidos

- Criação de pedidos
- Inclusão de um ou mais itens
- Cálculo de subtotal por item
- Cálculo do valor total
- Listagem paginada
- Limite máximo de 50 pedidos por página
- Consulta de pedido por ID
- Visualização detalhada do pedido
- Atualização de status
- Validação das transições de status

### Informações do cliente

Cada pedido mantém um snapshot das informações fornecidas no momento da criação:

- Nome
- Telefone
- E-mail opcional
- Endereço estruturado de entrega

O endereço contém:

- Rua ou avenida
- Número
- Complemento
- Bairro
- Cidade
- Estado
- CEP

### Status disponíveis

- `RECEBIDO`
- `EM_PREPARO`
- `SAIU_PARA_ENTREGA`
- `ENTREGUE`
- `CANCELADO`

---

## Tecnologias

### Backend

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Security
- Spring Session JDBC
- Spring Data JPA
- Hibernate
- Bean Validation
- Flyway
- Maven
- PostgreSQL

### Frontend

- React
- TypeScript
- Vite
- Material UI
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL em container
- Maven Wrapper
- Git

---

## Arquitetura

O projeto utiliza um monorepositório contendo backend, frontend, documentação e infraestrutura.

```text
food-order-tracker/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yaml
├── .env.example
└── README.md
```

### Backend

O backend utiliza arquitetura em camadas com organização por módulos de negócio.

```text
backend/src/main/java/com/foody/ordertracker/
├── authentication/
├── order/
├── security/
├── shared/
└── user/
```

Dentro dos módulos, as responsabilidades são separadas entre:

- `controller`
- `service`
- `repository`
- `domain`
- `dto`
- `mapper`

### Frontend

O frontend também é organizado por módulos.

```text
frontend/src/
├── api/
├── components/
├── modules/
│   ├── auth/
│   └── orders/
├── routes/
├── theme/
├── types/
├── App.tsx
└── main.tsx
```

Arquivos específicos de uma funcionalidade permanecem próximos ao módulo correspondente, como:

- chamadas HTTP;
- páginas;
- componentes;
- tipos;
- schemas;
- hooks;
- contextos.

---

## Decisões técnicas

### PostgreSQL em vez de SQLite

Embora o desafio permitisse SQLite ou similar, foi utilizado PostgreSQL para aproximar o projeto de um ambiente real e facilitar o uso de:

- constraints;
- índices;
- tipos adequados;
- sessões persistidas;
- migrations;
- execução com Docker.

### Flyway

O schema do banco é controlado por migrations versionadas.

As migrations são executadas automaticamente quando o backend é iniciado.

### Sessão em vez de JWT no Local Storage

A autenticação utiliza sessão persistida no banco de dados com Spring Session JDBC.

O identificador da sessão é enviado ao navegador por cookie `HTTPOnly`, reduzindo sua exposição a scripts executados no frontend.

Não são armazenados tokens de autenticação no `localStorage`.

### Proteção CSRF

Como a autenticação utiliza cookies, as operações que alteram estado são protegidas por token CSRF.

O frontend obtém o token e o envia no header:

```text
X-XSRF-TOKEN
```

### Endereço como Value Object

O endereço de entrega pertence ao pedido e é representado no domínio como um objeto embutido.

Ele não possui tabela ou ciclo de vida independente.

Essa decisão permite:

- manter os campos estruturados;
- simplificar a exibição no frontend;
- preservar o endereço histórico do pedido;
- evitar parsing de uma string única.

### Dados do cliente como snapshot

Nome, telefone, e-mail e endereço são armazenados diretamente no pedido.

Não foi criada uma entidade de cliente, pois cadastro e gerenciamento de clientes não fazem parte do escopo do desafio.

### Paginação

A listagem utiliza paginação no backend.

Configuração adotada:

```text
Página inicial: 0
Tamanho padrão: 20
Tamanho máximo: 50
Ordenação: mais recentes primeiro
```

### Filtros no frontend

Os filtros por status e a busca textual são aplicados sobre a página atualmente carregada.

Filtros globais no backend ficaram definidos como evolução futura.

### Docker Compose

O ambiente completo pode ser iniciado com um único comando.

O Compose sobe:

- PostgreSQL
- Backend
- Frontend

O frontend utiliza o servidor de preview do Vite dentro do container, sem Nginx, mantendo a infraestrutura compatível com o escopo do desafio.

---

## Pré-requisitos

Para executar todo o projeto com Docker:

- Docker
- Docker Compose

Para desenvolvimento local sem containers para as aplicações:

- Java 21
- Node.js 22 ou compatível
- npm
- Docker, para executar o PostgreSQL

---

## Configuração

Na raiz do projeto, crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Exemplo:

```env
POSTGRES_DB=foody_tracker
POSTGRES_USER=foody
POSTGRES_PASSWORD=change_me

POSTGRES_HOST=localhost
POSTGRES_PORT=5433

CORS_ALLOWED_ORIGINS=http://localhost:5173
SESSION_COOKIE_SECURE=false
```

O arquivo `.env` não deve ser versionado.

---

## Executando com Docker Compose

Na raiz do projeto:

```bash
docker compose up --build
```

Após a inicialização:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
Health:   http://localhost:8080/api/health
Banco:    localhost:5433
```

O frontend escuta internamente na porta `4173`, utilizada pelo `vite preview`, mas é publicado pelo Docker na porta `5173`:

```text
localhost:5173 → container:4173
```

Para executar em segundo plano:

```bash
docker compose up -d --build
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para encerrar:

```bash
docker compose down
```

Para encerrar e remover também o volume do banco:

```bash
docker compose down -v
```

---

## Executando em desenvolvimento local

### 1. Subir somente o banco

Na raiz:

```bash
docker compose up -d database
```

### 2. Executar o backend

```bash
cd backend

set -a
source ../.env
set +a

./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### 3. Executar o frontend

Em outro terminal:

```bash
cd frontend

npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

O arquivo `frontend/.env` deve conter:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Comandos de validação

### Backend

```bash
cd backend

./mvnw clean compile
./mvnw clean test
./mvnw clean package
```

### Frontend

```bash
cd frontend

npm run lint
npm run build
```

### Ambiente completo limpo

```bash
docker compose down -v
docker compose up --build
```

Esse fluxo recria o banco e valida a aplicação desde as migrations iniciais.

---

## Principais endpoints

### Autenticação

```http
GET  /api/auth/csrf
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Pedidos

```http
POST  /api/orders
GET   /api/orders
GET   /api/orders/{id}
PATCH /api/orders/{id}/status
```

### Health check

```http
GET /api/health
```

---

## Exemplo de criação de pedido

```http
POST /api/orders
```

```json
{
  "customerName": "José da Silva",
  "customerPhone": "(11) 99999-9999",
  "customerEmail": "jose@email.com",
  "deliveryAddress": {
    "street": "Rua do Almeirão",
    "number": "45",
    "complement": "Casa 2",
    "neighborhood": "Jardim Monte Santo",
    "city": "Cotia",
    "state": "SP",
    "zipCode": "06700-000"
  },
  "items": [
    {
      "description": "Hambúrguer grande com batata frita",
      "quantity": 2,
      "unitPrice": 23.00
    },
    {
      "description": "Coca-Cola 600ml",
      "quantity": 1,
      "unitPrice": 8.00
    }
  ]
}
```

---

## Fluxo da aplicação

```text
Cadastro
→ Login
→ Listagem de pedidos
→ Criação de pedido
→ Visualização dos detalhes
→ Atualização do status
→ Logout
```

Apenas usuários autenticados podem acessar as rotas de pedidos.

---

## Segurança

Foram implementados:

- senhas armazenadas com BCrypt;
- sessão persistida no PostgreSQL;
- cookie de sessão `HTTPOnly`;
- proteção CSRF;
- CORS configurável por variável de ambiente;
- rotas privadas no backend;
- rotas protegidas no frontend;
- invalidação de sessão no logout;
- tratamento de respostas `401` e `403`;
- mensagens de erro sem exposição de senha ou hash;
- validação de entrada no backend.

---

## Tratamento de erros

A API possui tratamento global para cenários como:

- dados inválidos;
- credenciais incorretas;
- e-mail já cadastrado;
- pedido não encontrado;
- transição de status inválida;
- JSON malformado;
- acesso sem autenticação;
- acesso negado;
- violações de integridade.

Exemplo:

```json
{
  "timestamp": "2026-08-03T18:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Order not found",
  "path": "/api/orders/id",
  "fieldErrors": {}
}
```

---

## Limitações conhecidas

- Filtros de status e busca textual são aplicados somente sobre a página atual.
- Não há cadastro ou gerenciamento de clientes.
- Não há recuperação ou alteração de senha.
- Não há confirmação de e-mail.
- Não há notificações em tempo real.
- Não há atualização automática dos pedidos via WebSocket.
- O frontend utiliza `vite preview`, adequado para demonstração local, mas não como servidor definitivo de produção.
- Testes automatizados não foram priorizados devido ao tempo e ao escopo do desafio.

---

## Próximos passos

Possíveis evoluções:

- busca e filtros globais no backend;
- código público e legível para pedidos;
- ordenação configurável;
- testes unitários e de integração;
- cobertura com JaCoCo;
- testes do frontend;
- documentação OpenAPI/Swagger;
- autenticação com papéis e permissões;
- diferenciação entre operadores e administradores;
- histórico das alterações de status;
- auditoria mais detalhada;
- notificações em tempo real com WebSockets;
- integração com mapas e geolocalização;
- integração com APIs de marketplaces;
- consulta automática de CEP;
- observações do cliente;
- deploy em ambiente cloud;
- servidor dedicado para os arquivos estáticos do frontend.

---

## Autor

Desenvolvido por **Raul Santos** como desafio técnico para a Foody Delivery.
