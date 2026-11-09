# Rubik's Cube

Aplicação web para aprender a resolver um cubo mágico 3×3 e praticar com um cubo interativo no navegador. O projeto combina tutoriais com imagens e vídeos, explicações das peças e movimentos controlados pelo teclado, com conteúdo em português e inglês.

A interface utiliza **React + TypeScript + Tailwind CSS**, com o pipeline existente do Create React App. O backend utiliza **Strapi 5 + MySQL**, com autenticação, conteúdo traduzido e dados pessoais protegidos por proprietário.

## Estado atual

| Área | Implementado | Próxima etapa |
| --- | --- | --- |
| Frontend | React 18, TypeScript, Tailwind 3 e integração com Strapi via SWR | Configurar os ambientes de publicação |
| Interface | Utilitários Tailwind, estilos contextuais com `@apply` e transformações 3D dinâmicas | Preservar as convenções visuais nos novos componentes |
| Cubo | Simulação 3×3, presets, salvar/retomar e tentativas com replay validado | Evoluir os recursos de prática |
| Tutoriais | Conteúdo publicado, mídias e navegação lidos do CMS nos dois idiomas | Editar e publicar conteúdo pelo painel |
| Backend | Strapi 5, Users & Permissions e dados pessoais conectados à interface | Configurar a hospedagem |
| Banco de dados | Modelos do DBML implementados no Strapi com MySQL | Configurar as credenciais do ambiente de uso |
| Testes | Testing Library e Playwright no frontend; contratos e integração com MySQL real no backend | Ampliar a cobertura conforme novas funcionalidades |
| Qualidade | Prettier, plugin Tailwind, ESLint, EditorConfig, Husky e workflow de CI | Manter as verificações nas próximas alterações |
| Skills | Cinco skills locais em `.agents/skills` | Aplicar conforme a tarefa de desenvolvimento |

O frontend consome o Strapi para tutoriais, preferências, presets, partidas e tentativas. Inicie MySQL e Strapi e execute o seed antes de usar os tutoriais. Visitantes podem ler conteúdo publicado e usar o cubo; uma conta do aplicativo habilita a persistência. Os JSONs locais permanecem como fonte da importação e dos testes.

## Funcionalidades atuais

- Cubo mágico 3×3 renderizado com transformações CSS em três dimensões.
- Movimentos das faces e rotação visual do cubo por teclado.
- Tutorial introdutório sobre os comandos.
- Explicações sobre nomes e posições das peças.
- Etapas de resolução com imagens, carrosséis e vídeos do YouTube.
- Alternância de idioma entre português e inglês.
- Navegação entre as páginas com React Router.
- Cadastro, login, logout e sincronização do idioma por usuário.
- Temas escuro, claro e personalizado, atalhos de teclado configuráveis e preferência ON/OFF para o futuro modo dicas.
- Presets de aparência, partidas salvas para retomar e histórico de tentativas resolvidas.

### Rotas do frontend

| Rota | Conteúdo |
| --- | --- |
| `/` e `/tutorial` | Apresentação dos comandos e introdução ao tutorial |
| `/tutorial/parts` | Nomes e posições das peças |
| `/tutorial/step/:id` | Etapa de resolução identificada por `id` |
| `/rubicksCube` | Cubo interativo; grafia da rota existente |
| Demais caminhos | Página não encontrada |

### Controles do cubo

Na página do cubo interativo, os atalhos de fábrica são os seguintes. Eles podem ser remapeados nas configurações, e `/tutorial` mostra os comandos que estão ativos:

| Tecla | Movimento |
| --- | --- |
| `W` | Face frontal |
| `A` | Face esquerda |
| `S` | Face traseira |
| `D` | Face direita |
| `Q` | Face superior |
| `E` | Face inferior |
| `Shift` + tecla da face | Movimento inverso da face |
| Setas direcionais | Rotação visual do cubo |

## Tecnologias

### Presentes no repositório

As versões abaixo correspondem às faixas declaradas nos arquivos `package.json`; os arquivos de lock registram as versões resolvidas.

| Tecnologia | Versão declarada | Papel no projeto |
| --- | --- | --- |
| React e React DOM | Frontend `^18.2.0`; painel Strapi `^18.3.1` | Componentes e renderização das interfaces |
| TypeScript | Frontend `^4.9.5`; backend `^5.9.0` | Tipagem do frontend e da API |
| Create React App / `react-scripts` | `5.0.1` | Desenvolvimento, build e execução dos testes do frontend |
| React Router DOM | Frontend `^6.8.1`; painel Strapi `^6.30.1` | Navegação das interfaces |
| CSS e transformações 3D | Nativo do navegador | Layout, estilos e representação visual do cubo |
| Tailwind CSS | `^3.4.17` | Classes utilitárias, cores do tema e estilos contextuais com `@apply` |
| Swiper e `react-id-swiper` | `^9.2.0` e `^4.0.0` | Carrosséis dos tutoriais |
| Node.js | Backend: versões 22 a 26 | Runtime da API e das ferramentas; workflows usam Node.js 22 |
| Strapi e Users & Permissions | `5.60.0` | API, CMS, autenticação, papéis e mídia |
| MySQL / `mysql2` | MySQL 8.0+; Compose 8.4; driver `^3.15.0` | Persistência do backend |
| Zod | `^4.1.0` | Validação dos contratos e regras de domínio |
| `cubejs` | `1.3.2` | Validação física dos estados e consistência dos replays |
| SWR | `^2.5.1` | Cache e revalidação das consultas por usuário e idioma |
| DOMPurify | `^3.4.17` | Sanitização do texto rico recebido do CMS |
| `tsx` e Node Test Runner | `^4.20.0` e nativo do Node.js | Testes de contratos e integração MySQL |
| Jest e Testing Library | Jest via `react-scripts`; React `^13.4.0`, jest-dom `^5.16.5`, user-event `^13.5.0` | Infraestrutura de testes e interação com componentes |
| ESLint | Frontend: `react-app` e `react-app/jest`; backend: ESLint 8 e typescript-eslint 8 | Análise estática do frontend e da API |
| Prettier e plugin Tailwind | `^3.9.10` e `^0.6.14` | Formatação e ordenação automática das classes Tailwind |
| `eslint-config-prettier` | `^9.1.2` | Compatibilidade entre lint e formatação |
| Playwright | `^1.64.1` | Testes funcionais do build em desktop e celular |
| EditorConfig | `.editorconfig` | Convenções de indentação, codificação e quebras de linha |
| Husky e lint-staged | `^9.1.7` e `^16.4.0` | Verificação dos arquivos do frontend e backend preparados para commit |
| GitHub Actions | Workflows em `.github/workflows` | Qualidade do frontend e backend; integração com MySQL descartável |
| DBML / dbdiagram.io | Arquivo `back-end/diagram.dbml` | Documentação do modelo lógico dos dados |

O frontend usa Tailwind e CSS específico para detalhes visuais, com estilos dinâmicos no motor 3D. Dependências sem uso foram removidas: `classnames`, `styled-components` e seus tipos, `web-vitals`, `global` e o executável do Yarn. O projeto mantém npm e `package-lock.json` como instalação reproduzível.

### Stack planejada

| Tecnologia | Uso previsto | Situação |
| --- | --- | --- |
| Vercel | Hospedagem do frontend | Destino previsto; deploy ainda não configurado no repositório |
| Hospedagem do Strapi e MySQL | Execução contínua e dados persistentes | Provedor ainda a definir |

O backend usa i18n do Strapi com `pt-BR` e `en-US`, componentes para aparência e conteúdo dos tutoriais e papéis nativos de acesso. O antigo Fastify foi removido.

## Como rodar localmente

### Pré-requisitos

- Git para obter o repositório.
- Node.js em uma versão LTS compatível com as dependências e npm disponível no terminal.
- Um navegador atualizado.
- Portas `3000` e `1337` disponíveis, caso execute frontend e backend juntos.
- MySQL 8.0+ para o backend, ou Docker para usar o Compose MySQL 8.4 fornecido.

O backend declara suporte a Node.js 22 a 26 em `engines`; os workflows usam Node.js 22. O frontend mantém o pipeline do Create React App.

Os exemplos usam npm e os arquivos `package-lock.json` existentes. Não há `package.json` na raiz: execute cada comando no diretório indicado.

### Frontend

Na raiz do repositório:

```sh
cd front-end
npm ci
npm start
```

Abra [http://localhost:3000](http://localhost:3000). O servidor de desenvolvimento recarrega a página ao salvar alterações.

Configure `REACT_APP_STRAPI_URL` em `front-end/.env.local` se o backend não estiver em `http://localhost:1337`; o exemplo está em `front-end/.env.example`. A URL não inclui `/api`. Tutoriais e recursos pessoais exigem Strapi e MySQL disponíveis. Veja o [guia do frontend](front-end/README.md) para autenticação, persistência, CORS e testes completos.

### Backend: Strapi e MySQL

Em outro terminal, a partir da raiz do repositório:

```sh
cd back-end
npm ci
npm run setup
```

Configure `DATABASE_*` no `.env` gerado. O setup cria as chaves privadas e, em um `.env` existente, preenche somente chaves ausentes ou vazias, preservando os valores já definidos. Para usar o MySQL do Compose, execute `docker compose up -d mysql`; para usar MySQL já instalado, informe um banco e usuário exclusivos para o Strapi.

Depois que o banco estiver disponível:

```sh
npm run develop
```

Abra [http://localhost:1337/admin](http://localhost:1337/admin) para criar o administrador. A API usa o prefixo `/api`; `GET /_health` responde `204` quando o servidor está pronto.

Para importar os tutoriais, traduções e imagens atuais, execute `npm run seed` na pasta `back-end`, com o banco configurado. Em produção, use `npm run build` e `npm start`.

Consulte o [guia completo do backend](back-end/README.md) para autenticação, endpoints, configuração, regras dos dados e contratos de replay.

### Build e testes

| Diretório | Comando | Finalidade |
| --- | --- | --- |
| `front-end` | `npm start` | Executar o servidor de desenvolvimento |
| `front-end` | `npm run build` | Gerar os arquivos estáticos em `front-end/build` |
| `front-end` | `npm test` | Executar o Jest em modo interativo |
| `front-end` | `npm run test:ci` | Executar os testes unitários sem modo de observação |
| `front-end` | `npm run preview` | Servir o build localmente em `http://127.0.0.1:4173` |
| `front-end` | `npm run test:e2e` | Executar a suíte Playwright em desktop e celular |
| `front-end` | `npm run format` | Formatar o frontend e ordenar classes Tailwind |
| `front-end` | `npm run format:check` | Verificar a formatação sem alterar arquivos |
| `front-end` | `npm run lint` | Verificar o código com ESLint, sem aceitar avisos |
| `front-end` | `npm run lint:fix` | Aplicar correções automáticas do ESLint |
| `front-end` | `npm run typecheck` | Verificar tipos TypeScript sem emitir JavaScript |
| `back-end` | `npm run setup` | Criar `.env` com chaves privadas aleatórias |
| `back-end` | `npm run develop` | Iniciar o Strapi em desenvolvimento na porta `1337` |
| `back-end` | `npm run build` | Compilar o backend e o painel administrativo |
| `back-end` | `npm start` | Iniciar o Strapi em produção |
| `back-end` | `npm run seed` | Importar tutoriais, traduções, vídeos e imagens existentes |
| `back-end` | `npm test` | Executar os testes dos contratos de dados |
| `back-end` | `npm run test:integration` | Testar a API com banco MySQL exclusivo terminado em `_test` |
| `back-end` | `npm run format:check` | Verificar a formatação do backend |
| `back-end` | `npm run lint` | Verificar o código da API |
| `back-end` | `npm run typecheck` | Verificar tipos do backend |

Os testes unitários do frontend verificam idioma, correspondência dos movimentos visuais com o motor canônico e restauração das partidas. O Playwright cobre a interface, respostas e falhas da API e, com `STRAPI_E2E_URL` configurado, os fluxos de conta e persistência no Strapi real. Os workflows de backend e integração completa provisionam bancos MySQL descartáveis.

Para executar os testes de navegador, a partir de `front-end`:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

O Playwright inicia o preview automaticamente quando a porta `4173` está disponível. Caso exista um preview local nessa porta, ele será reutilizado fora da CI. Para usar um navegador Chrome já instalado, é possível definir `PLAYWRIGHT_CHANNEL=chrome` no ambiente antes de executar os testes.

## Tailwind CSS e preservação do visual

O projeto utiliza Tailwind 3, integrado ao Create React App sem trocar o bundler. A escolha segue a [integração documentada para esse pipeline](https://v3.tailwindcss.com/docs/guides/create-react-app).

- A configuração está em `front-end/tailwind.config.js`; as diretivas são carregadas em `src/index.css`.
- O Preflight está desativado para preservar os estilos nativos, as margens, as medidas e o comportamento dos componentes existentes.
- Os tokens `canvas`, `surface`, `ink`, `on-canvas`, `on-accent` e `accent` usam variáveis CSS para temas escuro, claro e personalizado, com cores próprias para fundos e textos.
- Os breakpoints `mobile`, `short-screen` e `compact-screen` preservam as condições originais de largura e altura.
- Layouts usam utilitários nas classes dos componentes. Estados de interação, seletores do Swiper e estilos compartilhados usam `@apply` nos arquivos CSS.
- As posições, dimensões e transformações calculadas pelo motor do cubo continuam em estilos dinâmicos. Pseudo-elementos, animações e barras de rolagem mantêm CSS específico quando necessário.

Novos componentes devem seguir esses tokens e convenções, preservando a aparência e os controles existentes.

## Formatação e qualidade do código

O setup segue a skill local `code-formatter-installer`. O frontend usa Prettier com indentação de dois espaços, aspas simples, ponto e vírgula, largura de 100 caracteres e ordenação de classes pelo `prettier-plugin-tailwindcss`. A configuração está em `front-end/.prettierrc.json`.

Para formatar e verificar, a partir de `front-end`:

```sh
npm run format
npm run format:check
npm run lint
npm run typecheck
npm run test:ci
```

O `.editorconfig` compartilha as convenções de edição. As configurações de VS Code recomendam Prettier, ESLint, EditorConfig e a extensão do Tailwind.

O `npm ci` instala o hook de pre-commit do Husky em um checkout Git. O hook executa lint e formatação nos arquivos do frontend e backend preparados para commit. Na CI, `HUSKY=0` evita a instalação dos hooks, e o workflow executa as verificações separadamente. Se precisar ignorar o hook em uma emergência, `git commit --no-verify` deve ser reservado a situações justificadas, com as verificações executadas posteriormente.

O workflow `frontend-quality.yml` usa Node.js 22 e verifica instalação, formatação, lint, tipos, testes unitários, build e testes Playwright.

## Backend e modelo de dados

O [diagrama em DBML](back-end/diagram.dbml) descreve o modelo lógico para Strapi 5 com MySQL. Ele pode ser aberto no [dbdiagram.io](https://dbdiagram.io).

| Tabela lógica | Responsabilidade |
| --- | --- |
| `users` | Conta e perfil, aproveitando Users & Permissions do Strapi |
| `roles` | Papéis de acesso dos usuários do aplicativo |
| `media_files` | Avatares e imagens gerenciados pela Media Library |
| `user_settings` | Idioma, tema e preset selecionado por usuário |
| `cube_appearances` | Cores, dimensões, animação e orientação visual inicial |
| `cube_presets` | Configurações visuais nomeadas e reutilizáveis |
| `solve_attempts` | Tentativas concluídas, duração, movimentos e aparência histórica |
| `saved_games` | Estado e progresso de partidas para retomar |
| `tutorials` | Conteúdo educativo traduzido e organizado por categoria e etapa |
| `tutorial_parts` | Blocos ordenados com explicação e imagem |
| `tutorial_videos` | Lista ordenada de vídeos de cada tutorial |

O diagrama não representa exatamente as tabelas físicas: o Strapi administra relações, componentes, mídias e versões de conteúdo. Não execute diretamente o SQL exportado pelo dbdiagram sobre o banco do Strapi.

O backend implementa a verificação de propriedade, snapshots independentes e validação dos estados e replays. As APIs de contas, preferências, presets, tentativas e partidas salvas estão disponíveis; as respectivas telas e a ligação com o motor atual ainda serão implementadas. Os detalhes estão no [guia do backend](back-end/README.md).

## Skills locais

As cinco skills do projeto são mantidas em [`.agents/skills`](.agents/skills). Elas contêm orientações para o agente de desenvolvimento; não são dependências de execução da aplicação.

| Skill | O que faz | Origem |
| --- | --- | --- |
| [`strapi-docs-mcp`](.agents/skills/strapi-docs-mcp/SKILL.md) | Orienta a consulta à documentação oficial do Strapi para APIs, modelos, configuração e plugins; também descreve como conectar o MCP de documentação. | [strapi/skills](https://github.com/strapi/skills) |
| [`react-patterns`](.agents/skills/react-patterns/SKILL.md) | Orienta composição de componentes, hooks, estado, efeitos, carregamento de dados e acessibilidade. As recomendações devem respeitar a versão de React e a arquitetura utilizadas. | [affaan-m/ecc](https://github.com/affaan-m/ecc) |
| [`vercel-react-best-practices`](.agents/skills/vercel-react-best-practices/SKILL.md) | Reúne práticas de desempenho para React: carregamento de dados, tamanho do bundle, renderizações e JavaScript. As regras exclusivas de Next.js só se aplicam se esse framework vier a ser utilizado. | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| [`playwright-best-practices`](.agents/skills/playwright-best-practices/SKILL.md) | Orienta a criação e manutenção de testes de navegador e API, seletores, asserções, isolamento, autenticação e diagnóstico de falhas. | [currents-dev/playwright-best-practices-skill](https://github.com/currents-dev/playwright-best-practices-skill) |
| [`code-formatter-installer`](.agents/skills/code-formatter-installer/SKILL.md) | Orienta a configuração de Prettier, ESLint, EditorConfig, scripts de formatação, hooks e verificações de integração contínua. | [patricio0312rev/skills](https://github.com/patricio0312rev/skills) |

Cada diretório contém um `SKILL.md` com as instruções e, quando fornecidos pelo autor, arquivos de referência. Para solicitar o uso explicitamente, mencione o nome da skill, por exemplo: `Use a skill react-patterns para revisar este componente`.

A skill de Strapi está instalada, mas a conexão com o servidor MCP exige configuração própria e autenticação OAuth. Ela não conecta nem instala o Strapi automaticamente. Consulte as [instruções oficiais do Docs MCP](https://docs.strapi.io/cms/ai/docs-mcp-server).

As ferramentas de Playwright e formatação foram configuradas no frontend. A presença das skills fornece as orientações; a instalação das ferramentas é feita pelo `npm ci`.

## Estrutura do repositório

```text
rubiks-cube/
├── .agents/
│   └── skills/                # Skills locais de desenvolvimento
├── back-end/
│   ├── diagram.dbml           # Modelo lógico para Strapi + MySQL
│   ├── config/                # Banco, servidor, admin, plugins e CORS
│   ├── src/api/               # Coleções, controladores, serviços e rotas
│   ├── src/components/        # Aparência, partes e vídeos
│   ├── src/extensions/        # Extensão do usuário nativo do Strapi
│   ├── src/lib/               # Validações, propriedade, bootstrap e importação
│   ├── scripts/               # Configuração e seed
│   ├── tests/                 # Contratos e integração com MySQL
│   ├── docker-compose.yml     # MySQL 8.4 para desenvolvimento
│   ├── .env.example           # Configuração sem credenciais reais
│   ├── README.md              # Guia completo da API
│   └── package.json
├── front-end/
│   ├── public/                # Arquivos públicos e imagens
│   ├── scripts/               # Servidor de preview do build
│   ├── tests/                 # Testes de navegador com Playwright
│   ├── src/
│   │   ├── api/               # Cliente HTTP, contratos e consultas SWR
│   │   ├── cube/              # Estado canônico e adaptação do motor visual
│   │   ├── Components/        # Componentes compartilhados
│   │   ├── Contexts/          # Idioma, estado e motor do cubo
│   │   ├── Pages/             # Páginas e conteúdo dos tutoriais
│   │   ├── types/             # Tipos e interfaces TypeScript
│   │   └── App.tsx            # Composição e rotas da aplicação
│   ├── tailwind.config.js     # Tema, breakpoints e integração Tailwind
│   ├── playwright.config.ts   # Projetos desktop e celular
│   └── package.json
└── README.md
```

## Publicação planejada

O frontend será publicado na Vercel. Para o pipeline atual, a configuração prevista é:

```text
Root Directory:   front-end
Build Command:    npm run build
Output Directory: build
```

Antes do deploy, validar o build e configurar o acesso direto às rotas da SPA. As configurações de build deverão ser revistas se o Create React App for substituído. Consulte a [documentação da Vercel para Create React App](https://vercel.com/docs/frameworks/frontend/create-react-app).

O Strapi será hospedado separadamente em um serviço adequado à execução contínua de Node.js ou Docker, com MySQL e armazenamento persistente para os uploads. O provedor ainda não foi definido. A integração deverá configurar a URL da API, CORS, autenticação e armazenamento de mídia. Consulte as [orientações de deploy do Strapi](https://docs.strapi.io/cms/deployment) e suas [considerações sobre ambientes serverless](https://docs.strapi.io/cms/faq).

## Próximas etapas

- [ ] Definir e registrar a versão de Node.js e o gerenciador de pacotes adotado.
- [x] Integrar Tailwind 3 ao pipeline do frontend.
- [x] Migrar a estilização preservando o motor 3D e os controles existentes.
- [x] Substituir o backend Fastify por Strapi 5.
- [x] Configurar MySQL e implementar os modelos a partir do DBML.
- [x] Implementar importação dos tutoriais, imagens, vídeos e traduções para o Strapi.
- [x] Implementar autenticação e proteção dos dados por usuário no backend.
- [x] Implementar APIs de preferências, presets, tentativas e partidas salvas.
- [x] Definir e validar o contrato de estado e movimentos para replay.
- [x] Conectar as telas de tutoriais ao Strapi e implementar as telas dos recursos pessoais.
- [x] Adaptar o motor do frontend para o contrato de estado e movimentos do backend.
- [x] Configurar formatação, lint e testes funcionais com Playwright.
- [ ] Validar e configurar a publicação do frontend na Vercel e do backend no provedor escolhido.
