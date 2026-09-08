# Astrembio

Uma página para reunir seus links e compartilhar sua presença online.

O **Astrembio** é um sistema de link na bio com cadastro, painel de gerenciamento e perfis públicos acessíveis por `/@username`. O usuário cria seu perfil, adiciona seus links e compartilha um único endereço.

Projeto em desenvolvimento, criado para aprofundar meus estudos em React, TypeScript e Supabase por meio da construção de uma aplicação com autenticação e persistência de dados.

## Funcionalidades

- Cadastro com e-mail, senha e confirmação de senha.
- Fluxo de confirmação de e-mail, conforme a configuração do Supabase Auth.
- Login, recuperação da sessão ao abrir a aplicação e logout.
- Painel com acesso condicionado à sessão do usuário.
- Configuração inicial de username, nome de exibição e biografia.
- Criação e exclusão de links com persistência no PostgreSQL.
- Validação de títulos e endereços HTTP/HTTPS.
- Prévia do perfil no painel.
- Página pública por username, acessível sem login.
- Layout responsivo, estados de carregamento, mensagens de erro e listas vazias.
- Exibição de avatar quando houver uma URL cadastrada, com inicial do nome como alternativa para perfis sem foto.

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| React 18 | Componentes, formulários e estado da interface |
| TypeScript | Tipagem dos dados, props e serviços |
| Vite | Desenvolvimento local e build |
| React Router | Navegação, rotas e parâmetros da URL |
| Supabase Auth | Cadastro, login e sessão |
| PostgreSQL + Supabase | Armazenamento de perfis e links |
| Row Level Security (RLS) | Regras de acesso aos registros no banco |
| CSS | Layout e estilos dos componentes |

Atualmente, o frontend acessa o Supabase pelo cliente JavaScript. Node.js é usado para executar as ferramentas de desenvolvimento; uma API Node.js própria ainda não foi implementada.

## Conceitos praticados

Durante o desenvolvimento, trabalhei com componentes reutilizáveis, props, formulários controlados, atualização imutável de estado, efeitos com limpeza e operações assíncronas com `async/await`.

A integração com o Supabase também trouxe a prática de modelagem relacional, chaves estrangeiras, migrações SQL e a diferença entre autenticação e autorização. A organização em serviços separa as consultas ao banco da apresentação dos dados na interface.

## Como executar

### Pré-requisitos

- Node.js 22 ou superior, conforme o requisito da versão instalada do cliente Supabase.
- npm e Git.
- Um projeto no Supabase.

### 1. Clonar e instalar

```bash
git clone https://github.com/luisgfleite/astrembio.git
cd astrembio
npm ci
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto, ao lado de `package.json`:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

Use a URL e a chave pública do seu projeto Supabase: uma chave publicável ou a chave legada `anon`. O nome da variável acima é o esperado pelo código atual.

Variáveis com prefixo `VITE_` são disponibilizadas ao navegador. Nunca coloque uma chave secreta ou `service_role` nelas. O arquivo `.env.local` já está ignorado pelo Git; a proteção dos registros depende das políticas do banco.

### 3. Criar as tabelas e políticas

Em um projeto sem essas tabelas, execute o conteúdo dos arquivos abaixo no SQL Editor do Supabase, nesta ordem:

1. `supabase/migrations/202609070001_create_profiles.sql`
2. `supabase/migrations/202609070002_create_links.sql`

Os scripts criam as tabelas, os relacionamentos, as permissões e as políticas RLS. Execute cada migração uma única vez. Se as tabelas já existirem, confira a estrutura antes de aplicar os scripts; eles não são idempotentes.

### 4. Configurar a autenticação

No painel do Supabase, confira o provedor de e-mail e configure a confirmação de e-mail conforme o fluxo desejado. Em **Authentication → URL Configuration**, use como **Site URL** o endereço local da aplicação, normalmente `http://localhost:5173`.

Se o Vite iniciar em outra porta, ajuste esse endereço. Com confirmação ativada, confirme o cadastro pelo e-mail recebido antes de fazer login.

### 5. Iniciar a aplicação

```bash
npm run dev
```

Abra o endereço exibido no terminal. Reinicie o servidor de desenvolvimento se alterar as variáveis de ambiente.

Para experimentar o fluxo completo:

1. Acesse `/register` e crie uma conta.
2. Confirme o e-mail, se solicitado, e entre em `/login`.
3. Configure seu perfil no painel.
4. Adicione links e atualize a página para conferir a persistência.
5. Abra `/@seu_username` em uma janela anônima para visualizar o perfil público.

Um endereço `localhost` funciona apenas no ambiente local; compartilhar o perfil na internet exige hospedar a aplicação.

## Rotas

| Endereço | Comportamento |
| --- | --- |
| `/` | Redireciona para o painel |
| `/register` | Cadastro de conta |
| `/login` | Login com e-mail e senha |
| `/dashboard` | Gerenciamento do perfil e dos links; exige sessão na interface |
| `/@username` | Perfil público e seus links, sem necessidade de login |

## Dados e permissões

Cada conta em `auth.users` pode ter um registro em `profiles`, usando o mesmo ID. Cada perfil pode ter vários registros em `links`, associados pela coluna `profile_id`.

- **profiles:** ID, username único, nome de exibição, biografia, URL do avatar e data de criação.
- **links:** ID, perfil proprietário, título, URL e data de criação.

As migrações permitem leitura pública dos perfis e links. Usuários autenticados podem criar e atualizar o próprio perfil, além de criar, atualizar e excluir os próprios links. A interface atual oferece criação de perfil e criação/exclusão de links; edição ainda está prevista.

As políticas comparam `auth.uid()` ao ID do proprietário. A condição de sessão na rota controla a interface; RLS controla as operações no banco. Excluir uma conta remove seu perfil e os links associados por meio dos relacionamentos com `on delete cascade`.

## Estrutura

```text
src/
  components/       # Cabeçalho, link e configuração inicial do perfil
  pages/            # Login, cadastro e perfil público
  services/         # Consultas e gravações de perfis e links
  lib/              # Inicialização do cliente Supabase
  types/            # Tipos compartilhados
  App.tsx           # Rotas, sessão e painel
  main.tsx          # Entrada do React e configuração do roteador
  index.css         # Estilos da aplicação
supabase/
  migrations/       # Criação de tabelas e políticas RLS
```

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npx tsc --noEmit` | Verifica os tipos sem gerar arquivos |
| `npm run build` | Gera o build em `dist` |
| `npm run preview` | Serve o build localmente para inspeção |
| `npm run lint` | Executa a configuração atual do ESLint |

O build atual executa apenas o Vite; rode a verificação de TypeScript separadamente. A configuração do ESLint ainda contempla apenas arquivos `.js` e `.jsx`, e precisa ser adaptada para analisar `.ts` e `.tsx`.

## Próximos passos

- Edição dos dados do perfil e dos links.
- Upload de avatar com Supabase Storage.
- Reordenação de links e personalização visual.
- API Node.js com TypeScript para praticar lógica de servidor.
- Testes automatizados dos fluxos e das políticas de acesso.
- Configuração do ESLint para TypeScript.
- Deploy da aplicação.

## Autor

Desenvolvido por **Luis Gustavo**.

[Perfil no GitHub](https://github.com/luisgfleite) · [Código do projeto](https://github.com/luisgfleite/astrembio)
