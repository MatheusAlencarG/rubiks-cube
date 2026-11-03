# Rubik's Cube

Aplicação web para aprender a resolver um cubo mágico 3×3 e praticar com um cubo interativo no navegador. O projeto combina tutoriais com imagens e vídeos, explicações das peças e movimentos controlados pelo teclado, com conteúdo em português e inglês.

A direção definida para a evolução do projeto é manter **React + TypeScript** no frontend, adotar **Tailwind CSS** para a interface e migrar o backend para **Strapi 5 + MySQL**.

## Estado atual

| Área | Implementado | Próxima etapa |
| --- | --- | --- |
| Frontend | React 18, TypeScript e Create React App | Revisar o pipeline de build para integrar Tailwind CSS |
| Interface | CSS, estilos dinâmicos e `classnames` | Migrar a estilização da interface para Tailwind |
| Cubo | Simulação 3×3 e controles pelo teclado no navegador | Preservar o motor durante as migrações e definir o formato de persistência |
| Tutoriais | Conteúdo local em JSON, imagens e vídeos incorporados | Gerenciar conteúdo e traduções pelo Strapi |
| Backend | Servidor Fastify com a rota `GET /ping` | Substituir por Strapi 5 |
| Banco de dados | Modelo lógico em DBML | Implementar os modelos no Strapi com MySQL |
| Testes | Ferramentas do Create React App e Testing Library | Criar cobertura funcional e integrar Playwright |
| Skills | Cinco skills locais em `.agents/skills` | Aplicar conforme a tarefa de desenvolvimento |

Strapi, MySQL e Tailwind ainda não estão instalados ou integrados à aplicação. Os comandos abaixo executam a versão atual do projeto. O frontend usa conteúdo local e pode ser executado sem iniciar o backend.

## Funcionalidades atuais

- Cubo mágico 3×3 renderizado com transformações CSS em três dimensões.
- Movimentos das faces e rotação visual do cubo por teclado.
- Tutorial introdutório sobre os comandos.
- Explicações sobre nomes e posições das peças.
- Etapas de resolução com imagens, carrosséis e vídeos do YouTube.
- Alternância de idioma entre português e inglês.
- Navegação entre as páginas com React Router.

### Rotas do frontend

| Rota | Conteúdo |
| --- | --- |
| `/` e `/tutorial` | Apresentação dos comandos e introdução ao tutorial |
| `/tutorial/parts` | Nomes e posições das peças |
| `/tutorial/step/:id` | Etapa de resolução identificada por `id` |
| `/rubicksCube` | Cubo interativo; grafia da rota existente |
| Demais caminhos | Página não encontrada |

### Controles do cubo

Na página do cubo interativo, os atalhos atuais são:

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
| React e React DOM | `^18.2.0` | Componentes, estado e renderização da interface |
| TypeScript | Frontend `^4.9.5`; backend `^5.3.3` | Tipagem do frontend e do servidor atual |
| Create React App / `react-scripts` | `5.0.1` | Desenvolvimento, build e execução dos testes do frontend |
| React Router DOM | `^6.8.1` | Navegação da aplicação |
| CSS e transformações 3D | Nativo do navegador | Layout, estilos e representação visual do cubo |
| `classnames` | `^2.3.2` | Composição condicional de classes CSS |
| Swiper e `react-id-swiper` | `^9.2.0` e `^4.0.0` | Carrosséis dos tutoriais |
| Node.js | Sem versão fixada no repositório | Runtime do backend e das ferramentas de desenvolvimento |
| Fastify | `^4.25.2` | Backend inicial com a rota `/ping` |
| Jest e Testing Library | Jest via `react-scripts`; React `^13.4.0`, jest-dom `^5.16.5`, user-event `^13.5.0` | Infraestrutura de testes e interação com componentes |
| ESLint | Configuração `react-app` e `react-app/jest` | Análise estática integrada ao frontend |
| DBML / dbdiagram.io | Arquivo `back-end/diagram.dbml` | Documentação do modelo lógico dos dados |

O frontend também declara `styled-components` (`^5.3.8`), `web-vitals` (`^2.1.4`), `global` (`^4.4.0`) e Yarn (`^1.22.21`), além dos pacotes de tipos `@types/*`. Estarem no manifesto não significa que estejam integrados às telas: a estilização atual utiliza arquivos CSS e estilos dinâmicos. Essas dependências devem ser revisadas durante a migração.

### Stack planejada

| Tecnologia | Uso previsto | Situação |
| --- | --- | --- |
| Tailwind CSS | Estilização da interface, responsividade e padronização visual | A integrar |
| Strapi 5 | API, painel administrativo, conteúdo, mídia e autenticação | A implementar em substituição ao Fastify |
| MySQL | Persistência dos dados gerenciados pelo Strapi | Modelagem proposta; sem conexão configurada |
| i18n do Strapi | Gestão das traduções dos tutoriais | Planejado |
| Playwright | Testes de navegação, integração e API | Skill disponível; ferramenta e suíte ainda não configuradas |
| Prettier e EditorConfig | Formatação e convenções de edição | Skill de configuração disponível; setup ainda pendente |
| Vercel | Hospedagem do frontend | Destino previsto; deploy ainda não configurado no repositório |

## Como rodar localmente

### Pré-requisitos

- Git para obter o repositório.
- Node.js em uma versão LTS compatível com as dependências e npm disponível no terminal.
- Um navegador atualizado.
- Portas `3000` e `8080` disponíveis, caso execute frontend e backend juntos.

O repositório ainda não fixa uma versão de Node.js em `engines` ou em um arquivo de versão. A versão adotada deverá ser validada e registrada ao atualizar o pipeline de build.

Os exemplos usam npm e os arquivos `package-lock.json` existentes. O frontend também contém `yarn.lock`; para seguir estas instruções, use npm de forma consistente. Não há `package.json` na raiz: execute cada comando no diretório indicado.

### Frontend

Na raiz do repositório:

```sh
cd front-end
npm ci
npm start
```

Abra [http://localhost:3000](http://localhost:3000). O servidor de desenvolvimento recarrega a página ao salvar alterações.

Na versão atual, não é necessário configurar MySQL, Strapi ou variáveis de ambiente para visualizar o frontend.

### Backend atual: Fastify

Em outro terminal, a partir da raiz do repositório:

```sh
cd back-end
npm ci
npm run build
npm start
```

O build compila `index.ts` para `index.js`; o comando de inicialização executa esse JavaScript. Após alterar o TypeScript, refaça o build e reinicie o servidor.

Verifique [http://localhost:8080/ping](http://localhost:8080/ping). A resposta esperada é `pong`, seguida de uma quebra de linha.

Esse servidor ainda não oferece autenticação, persistência, endpoints de tutoriais ou integração com o frontend. Os comandos específicos de desenvolvimento e produção do Strapi serão documentados quando a migração estiver implementada.

### Build e testes

| Diretório | Comando | Finalidade |
| --- | --- | --- |
| `front-end` | `npm start` | Executar o servidor de desenvolvimento |
| `front-end` | `npm run build` | Gerar os arquivos estáticos em `front-end/build` |
| `front-end` | `npm test` | Executar o Jest em modo interativo |
| `front-end` | `npm test -- --watchAll=false` | Executar os testes sem o modo de observação |
| `back-end` | `npm run build` | Compilar o TypeScript do servidor atual |
| `back-end` | `npm start` | Iniciar o Fastify na porta `8080` |

O arquivo de teste atual do frontend ainda é um esqueleto sem asserções. O script `test` do backend é um placeholder que termina com erro. A presença das ferramentas não representa cobertura funcional; ainda não existem comandos de Playwright, lint ou formatação dedicados ao projeto.

## Adoção de Tailwind CSS

Tailwind CSS será a base da estilização da interface. A migração deverá preservar o comportamento do cubo, os atalhos, a navegação e os dois idiomas.

Antes da instalação, será necessário revisar a compatibilidade do pipeline atual do Create React App e definir a versão e a integração do Tailwind. Avaliar Vite é uma possibilidade dessa revisão, não uma migração já implementada. Consulte a [documentação oficial de integração com Vite](https://tailwindcss.com/docs/installation/using-vite).

A implementação deverá:

- Usar classes utilitárias para layout, tipografia, espaçamento e responsividade.
- Definir convenções de cores, tamanhos e estados dos componentes.
- Preservar estilos calculados pelo motor 3D, usando estilos dinâmicos ou variáveis CSS quando necessário.
- Substituir os estilos existentes de forma gradual e revisar dependências de estilização sem uso.
- Integrar a formatação ao fluxo de desenvolvimento quando as ferramentas forem configuradas.

Não há comandos de instalação de Tailwind nesta seção porque o pipeline de integração ainda será definido.

## Backend e modelo de dados planejados

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

Na implementação, os dados de cada usuário deverão ser protegidos por verificação de propriedade. Estados e movimentos do cubo exigirão um contrato versionado e validação no motor. Contas, presets, histórico, replay e partidas salvas ainda são funcionalidades planejadas.

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

Da mesma forma, as skills de Playwright e formatação não instalam as ferramentas apenas por estarem presentes no repositório.

## Estrutura do repositório

```text
rubiks-cube/
├── .agents/
│   └── skills/                # Skills locais de desenvolvimento
├── back-end/
│   ├── diagram.dbml           # Modelo lógico para Strapi + MySQL
│   ├── index.ts               # Servidor Fastify atual
│   ├── index.js               # JavaScript executado pelo servidor
│   └── package.json
├── front-end/
│   ├── public/                # Arquivos públicos e imagens
│   ├── src/
│   │   ├── Components/        # Componentes compartilhados
│   │   ├── Contexts/          # Idioma, estado e motor do cubo
│   │   ├── Pages/             # Páginas e conteúdo dos tutoriais
│   │   ├── types/             # Tipos e interfaces TypeScript
│   │   └── App.tsx            # Composição e rotas da aplicação
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
- [ ] Revisar o pipeline do frontend e integrar Tailwind CSS.
- [ ] Migrar a estilização preservando o motor 3D e os controles existentes.
- [ ] Substituir o backend Fastify por Strapi 5.
- [ ] Configurar MySQL e implementar os modelos a partir do DBML.
- [ ] Migrar tutoriais, imagens, vídeos e traduções para o Strapi.
- [ ] Implementar autenticação e proteção dos dados por usuário.
- [ ] Implementar preferências, presets e histórico de tentativas.
- [ ] Definir o contrato de estado e movimentos para replay e partidas salvas.
- [ ] Configurar formatação, lint e testes funcionais com Playwright.
- [ ] Validar e configurar a publicação do frontend na Vercel e do backend no provedor escolhido.
