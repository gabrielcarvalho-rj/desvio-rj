# Desvio RJ - Frontend

Interface web do Desvio RJ, plataforma para descobrir lugares no Rio de Janeiro, salvar favoritos, montar roteiros e publicar dicas.

React + Vite + React Router + Axios, com CSS tradicional (sem Tailwind e sem TypeScript).

## Como executar

Pré-requisitos: PostgreSQL (Docker) na porta 5432 e backend Spring Boot em `http://localhost:8080`.

```
npm install
npm run dev
```

Abra http://localhost:5173.

Outros comandos: `npm run build` (gera `dist/`) e `npm run lint`.

Se o backend estiver em outro endereço, crie um arquivo `.env` com `VITE_API_URL=http://seu-endereco:8080`.

## Login de desenvolvimento (ADMIN)

- E-mail: `admin@desviorj.com`
- Senha: `admin123`

## Estrutura

```
src/
  api/        api.js (Axios + token JWT), erros.js (mensagens da API)
  context/    AuthContext/AuthProvider (sessão), ToastContext/ToastProvider (avisos),
              ThemeContext/ThemeProvider (tema claro/escuro)
  hooks/      useApi (GET com loading/erro), useFavoritos
  routes/     AppRoutes (rota de layout + lazy), RotaPrivada (login e ADMIN)
  pages/      Home, Login, Cadastro, Lugares, LugarDetalhes, Favoritos,
              Roteiros, CriarRoteiro, RoteiroDetalhes, Perfil, Admin, NaoEncontrado
  components/ Layout (Navbar + Outlet + Footer), Navbar, Footer, LugarCard, ImagemLugar, DicasLugar, AdicionarRoteiro,
              Estados, Confirmacao, Icone e admin/ (lugares, categorias, interesses)
  utils/      imagens.js (fotos locais), formatar.js
  styles/     base, layout, home, lugares, roteiros, forms, admin
```

## Como a autenticação funciona

1. `POST /auth/login` devolve `{ token, id, nome, email, role }`.
2. O `AuthProvider` guarda esses dados no `localStorage` e expõe `usuario`, `autenticado` e `isAdmin`.
3. O interceptador do Axios (`api/api.js`) envia `Authorization: Bearer <token>` em toda requisição.
4. `RotaPrivada` bloqueia páginas na interface. A segurança de verdade continua no servidor.

## Tema claro/escuro

O `ThemeProvider` guarda `"claro"` ou `"escuro"` no `localStorage` (chave `desvioRJ.tema`); sem escolha salva, usa
`prefers-color-scheme`. Ele liga a classe `tema-escuro` no `<body>` e o CSS (`styles/base.css`) troca os valores das variáveis de cor.

## Imagens

`utils/imagens.js` reconhece os lugares originais pelo nome (ou pelo id 1 a 5) e usa as fotos de `public/imagens`. Lugares novos usam o `fotoUrl` do backend. Sem foto, aparece uma ilustração de fundo.
