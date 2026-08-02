# Foody Order Tracker

Mini sistema de rastreamento de pedidos desenvolvido como desafio técnico para a vaga de Desenvolvedor Full-Stack Pleno
da Foody Delivery.

O objetivo foi implementar uma solução próxima de um cenário real de mercado, priorizando organização, boas práticas,
segurança e arquitetura limpa, mesmo sendo um desafio de pequeno porte.

---

## Tecnologias

### Backend

- Java 21
- Spring Boot 4
- Spring Security
- Spring Session JDBC
- Spring Data JPA
- Flyway
- PostgreSQL
- Maven

### Frontend

- React
- Vite
- TypeScript

### Infraestrutura

- Docker Compose
- PostgreSQL
- Git

---

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login utilizando sessão
- Logout
- Sessões persistidas em banco de dados
- Cookies HTTPOnly
- Proteção CSRF

### Pedidos

- Criar pedido
- Buscar pedido por ID
- Listar pedidos com paginação
- Atualizar status do pedido

Status disponíveis:

- RECEBIDO
- EM_PREPARO
- SAIU_PARA_ENTREGA
- ENTREGUE
- CANCELADO

---

## Arquitetura

O backend foi organizado utilizando arquitetura em camadas.

```
backend
└── src/main/java/com/foody/ordertracker
    ├── authentication
    ├── order
    ├── user
    └── shared
```

Cada módulo contém sua própria separação entre:

- controller
- service
- repository
- domain
- dto
- mapper

---

## Segurança

O projeto utiliza autenticação baseada em sessão.

- Spring Session JDBC
- Cookie HTTPOnly
- Proteção CSRF
- BCrypt
- CORS configurado
- Endpoints protegidos pelo Spring Security

Nenhum token é armazenado no LocalStorage.

---

## Banco de dados

O banco é versionado utilizando Flyway.

As migrações são executadas automaticamente durante a inicialização da aplicação.

---

## Como executar

### Clonar

```bash
git clone ...
```

### Subir o banco

```bash
docker compose up -d database
```

### Configurar variáveis

Copie:

```
.env.example
```

para

```
.env
```

### Backend

```bash
cd backend

set -a
source ../.env
set +a

./mvnw spring-boot:run
```

Backend disponível em:

```
http://localhost:8080
```

---

## Estrutura do repositório

```
food-order-tracker
│
├── backend
├── frontend
├── docs
├── docker-compose.yaml
└── README.md
```

## Decisões Técnicas

Durante o desenvolvimento foram adotadas algumas decisões visando aproximar o projeto de um ambiente de produção.

- PostgreSQL em vez de SQLite.
- Flyway para versionamento do banco.
- Arquitetura em camadas.
- Spring Session JDBC para persistência das sessões.
- Cookies HTTPOnly em vez de JWT armazenado em LocalStorage.
- Proteção CSRF habilitada.
- Paginação na listagem de pedidos.
- Tratamento global de exceções.
- Limitação do tamanho máximo das páginas em 50 registros.

## Autor

Raul Santos
