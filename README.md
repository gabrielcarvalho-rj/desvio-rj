# Desvio RJ

**Aplicação web para descoberta de lugares e planejamento de passeios no Rio de Janeiro.**

Trabalho acadêmico individual — **Gabriel Carvalho da Costa Catramby** (matrícula **1260216595**).

O Desvio RJ reúne em uma única aplicação a descoberta de lugares do Rio (além dos cartões-postais mais conhecidos), favoritos, dicas e a montagem de roteiros. Banco de dados, backend e frontend executam em contêineres Docker, orquestrados por Docker Compose.

---

## 1. Funcionalidades

- Cadastro de usuário e login com autenticação JWT
- Perfis **USER** e **ADMIN**
- Listagem de lugares com filtros e página de detalhes
- Favoritos
- Dicas sobre os lugares
- Roteiros: criação, inclusão de lugares, horário e observação em cada parada
- Interesses do usuário e recomendações de lugares por afinidade de categoria (regra simples, sem IA)
- Perfil do usuário
- Área administrativa (somente ADMIN): CRUD de lugares, CRUD de categorias e cadastro de interesses
- Documentação da API em OpenAPI / Swagger UI

## 2. Arquitetura

```
Navegador
   │  http://localhost:5173
   ▼
┌──────────────────────── Docker Compose ────────────────────────┐
│  frontend (Nginx + build React/Vite)        porta 5173 → 80     │
│        │  o navegador chama a API em http://localhost:8080      │
│        ▼                                                        │
│  backend (Spring Boot, API REST + JWT)      porta 8080          │
│        │  jdbc:postgresql://postgres:5432/desvio_rj             │
│        ▼                                                        │
│  postgres (PostgreSQL 16, volume "pgdata")  porta 5432          │
└─────────────────────────────────────────────────────────────────┘
```

Dentro da rede do Docker, o backend encontra o banco pelo **nome do serviço** (`postgres`). O frontend roda no **navegador**, por isso acessa a API por `http://localhost:8080` (porta publicada pelo contêiner do backend).

## 3. Tecnologias

| Camada | Tecnologias |
|---|---|
| Backend | Java 17, Spring Boot 3.5, Maven, Spring Data JPA/Hibernate, Spring Security, JWT, BCrypt, Swagger/OpenAPI (springdoc) |
| Frontend | React 19, Vite, React Router, Axios, CSS próprio |
| Banco | PostgreSQL 16 |
| Infraestrutura | Docker, Docker Compose, Nginx |

## 4. Pré-requisitos

- **Docker Desktop** instalado e **em execução** (no Windows, com WSL 2).
- Conexão com a internet no primeiro build (download de imagens e dependências).
- Portas livres: **5173**, **8080** e **5432**.

Não é necessário instalar Java, Maven, Node.js nem PostgreSQL.

## 5. Estrutura de pastas

```
projeto/
├── docker-compose.yml        # orquestra os 3 serviços
├── README.md
├── database/
│   └── desvio_rj.sql         # dump do PostgreSQL (carga inicial)
├── backend/
│   ├── Dockerfile            # build Maven + execução com JRE 17
│   ├── pom.xml
│   └── src/                  # código Spring Boot
└── frontend/
    ├── Dockerfile            # build Vite + Nginx
    ├── nginx.conf            # servidor estático com fallback de SPA
    ├── package.json
    └── src/                  # código React
```

## 6. Como executar

Abra um terminal (PowerShell) **na pasta `projeto`**, onde está o `docker-compose.yml`, e execute:

```powershell
docker compose up --build
```

O primeiro build leva alguns minutos. A aplicação está pronta quando o terminal mostrar algo como `Started DesvioRjBackendApplication` (backend) e o PostgreSQL indicar `database system is ready to accept connections`.

### Endereços

| Serviço | URL |
|---|---|
| Frontend (site) | http://localhost:5173 |
| Backend (API) | http://localhost:8080 |
| Swagger / OpenAPI | http://localhost:8080/swagger-ui/index.html |
| JSON OpenAPI | http://localhost:8080/v3/api-docs |
| PostgreSQL | `localhost:5432` — banco `desvio_rj`, usuário `postgres`, senha `postgres` |

### Credenciais de demonstração local

> Apenas para demonstração acadêmica em ambiente local. Não é prática recomendada para produção.

| Perfil | E-mail | Senha |
|---|---|---|
| ADMIN | `admin@desviorj.com` | `admin123` |

Qualquer pessoa pode criar um usuário comum (USER) pela tela de cadastro.

## 7. Comandos Docker úteis

| Comando | O que faz |
|---|---|
| `docker compose up --build` | Constrói as imagens e sobe os 3 serviços (terminal fica preso mostrando os logs) |
| `docker compose up --build -d` | Igual, mas em segundo plano |
| `docker compose ps` / `docker ps` | Lista os contêineres em execução |
| `docker compose logs -f backend` | Acompanha os logs do backend |
| `docker compose stop` | Para os contêineres (mantém contêineres e dados) |
| `docker compose down` | Para e **remove os contêineres e a rede**. Os **dados do banco continuam** no volume |
| `docker compose down -v` | Faz o mesmo e **também apaga o volume** `pgdata`: **todos os dados do banco são removidos** |

## 8. Observações sobre o banco de dados

- O arquivo `database/desvio_rj.sql` é montado em `/docker-entrypoint-initdb.d/` do PostgreSQL.
- **Esse script só é executado na primeira subida, quando o volume `pgdata` está vazio.** Nas subidas seguintes o banco reaproveita os dados já persistidos, e o script é ignorado.
- Para **voltar ao estado inicial** do dump (descartando alterações feitas no uso da aplicação):

  ```powershell
  docker compose down -v
  docker compose up --build
  ```

- O backend usa `spring.jpa.hibernate.ddl-auto=update` e, a cada inicialização, garante o usuário ADMIN de demonstração.
- Os dados do dump incluem registros criados durante os testes do projeto.

## 9. Resolução rápida de problemas

| Sintoma | Causa provável e solução |
|---|---|
| `Cannot connect to the Docker daemon` / `error during connect` | O Docker Desktop não está aberto. Abra-o, aguarde ficar "running" e repita o comando |
| `port is already allocated` (5432) | Existe outro PostgreSQL ou um contêiner antigo usando a porta. Se for o contêiner de desenvolvimento: `docker stop postgres_desvio_rj`. Ou encerre o PostgreSQL local do Windows |
| `port is already allocated` (8080 ou 5173) | Há outro programa (ex.: backend/Vite rodando fora do Docker). Encerre-o e repita |
| Site abre, mas aparece erro de comunicação com o servidor | O backend ainda está iniciando (leva ~30–60 s). Aguarde `Started DesvioRjBackendApplication` e recarregue a página |
| Banco vazio ou sem os lugares de demonstração | O volume já existia vazio/antigo. Rode `docker compose down -v` e depois `docker compose up --build` |
| Alterei `VITE_API_URL` e nada mudou | Esse valor é gravado no build. Reconstrua: `docker compose build --no-cache frontend` e `docker compose up -d` |
| Falha no download de dependências durante o build | Verifique a conexão com a internet e repita `docker compose up --build` |
| Fontes diferentes no site | As fontes vêm do Google Fonts; sem internet o navegador usa uma fonte substituta |

## 10. Segurança — nota

Este projeto é uma entrega **acadêmica e local**. Senhas são armazenadas com BCrypt e a autenticação usa JWT (`Authorization: Bearer <token>`); escrita em lugares, categorias e interesses é restrita ao ADMIN. As credenciais, a chave JWT e as configurações do banco estão em texto simples para facilitar a demonstração, e a arquitetura **não deve ser considerada pronta para produção**.
