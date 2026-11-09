# Frontend React + Strapi

Use Node.js 22, instale as dependências com `npm ci` e copie `.env.example` para `.env.local` se precisar alterar o endereço do backend:

```dotenv
REACT_APP_STRAPI_URL=http://localhost:1337
```

A URL não inclui `/api`. Essa variável é pública e é incorporada no build do React. As chaves privadas e os tokens administrativos permanecem exclusivamente no backend. Reinicie `npm start` depois de mudar `.env.local`; na Vercel, configure a URL HTTPS do Strapi e faça um novo deploy. O backend deve permitir a origem do frontend em `CORS_ORIGINS`.

Com MySQL configurado, inicie o backend e importe o conteúdo existente com `npm run seed` na pasta `back-end`. Depois execute `npm start` aqui. Tutoriais publicados, partes, vídeos, imagens, idiomas e navegação são carregados pela Content API; o JSON local serve apenas como fonte da importação e dos testes, sem fallback nas telas. Carregamento, conteúdo ausente e indisponibilidade possuem estados próprios e opção de tentar novamente.

O texto rico é sanitizado com DOMPurify. Imagens relativas são resolvidas contra a URL do Strapi. Os textos dos controles e rótulos da interface continuam nas traduções locais. A paginação segue os tutoriais publicados e sua ordem no CMS.

## Conta e preferências

Abra a engrenagem para cadastrar uma conta do aplicativo ou entrar com e-mail e senha. Essa conta é diferente do administrador do Strapi. O JWT fica no `sessionStorage` da aba, é validado em `/users/me` ao recarregar e é enviado nas requisições privadas. Sair remove a sessão e os dados pessoais do cache; trocar de usuário reinicia a partida em memória.

O idioma muda imediatamente na interface e é sincronizado com `user-settings` quando há login. Visitantes mantêm o idioma no `localStorage`. Leituras usam SWR com cache separado por usuário e idioma; alterações revalidam as coleções correspondentes.

O menu também oferece temas escuro, claro e personalizado (fundo, painéis, texto e destaque), remapeamento das seis faces e das quatro rotações de visualização e restauração dos atalhos padrão. Para atribuir um comando, foque o campo e pressione uma letra, número ou seta. Uma tecla já usada troca de posição com o comando anterior; Shift continua reservado aos movimentos inversos das faces. A página `/tutorial` mostra sempre os atalhos atuais.

O modo dicas possui somente uma opção ON/OFF persistida. Ele ainda não apresenta sugestões nem altera o cubo. Tema, teclado e essa opção ficam em `localStorage` para visitantes e em `user-settings` para contas autenticadas. Após uma atualização do projeto, reinicie o backend para carregar os novos campos.

## Cubo e persistência

Os controles W/A/S/D/Q/E, Shift para inversos, setas, visual 3D, carrosséis e vídeos continuam disponíveis. Digitar em formulários não move o cubo. Os controles adicionais ficam em **Partidas e aparência**:

- **Salvar partida** cria ou atualiza o mesmo documento, com movimentos, duração, estado lógico, aparência e rotação visual. O tempo começa no primeiro movimento e inclui o tempo transcorrido durante a sessão aberta; retomar preserva o tempo acumulado e continua a contagem no próximo movimento.
- **Retomar** reconstrói o estado visual salvo imediatamente, sem reproduzir a animação de todo o histórico. Os movimentos anteriores são preservados nos salvamentos seguintes.
- **Nova partida** inicia outro cubo usando o preset ativo e reinicia o histórico em memória. Salve a partida atual antes de começar outra ou recarregar a página.
- Presets permitem criar, atualizar, selecionar e excluir aparência: cores, largura, raio das peças, animação e rotação inicial. Aplicar um preset inicia uma nova partida. Partidas já salvas conservam seu snapshot original.
- **Registrar tentativa resolvida** envia o replay ao backend quando o cubo termina resolvido. Tentativas e partidas salvas podem ser consultadas e excluídas pela conta proprietária.

O adaptador usa a ordem URFDLB e o mesmo motor `cubejs-1.3.2` do backend. As posições e classes CSS não são persistidas. Os testes comparam o motor visual com os movimentos canônicos, incluindo inversos, sequências mistas e restauração.

## Organização dos componentes

As rotas compartilham o layout com `Outlet`; páginas do cubo e dos carrosséis são carregadas sob demanda com `React.lazy` e `Suspense`. Menu e paginação são derivados da rota e dos tutoriais publicados, sem cópias em estado ou funções vazias de navegação.

`Disclosure` controla os painéis de idiomas e vídeos com estado React e atributos de acessibilidade. Configurações permitem acesso pelo teclado, Escape, retorno e contenção do foco. `TutorialCarousel` concentra as opções compartilhadas do Swiper e reage às mudanças de largura. `SavedGames` e `PresetEditor` separam a apresentação do fluxo de persistência em `CubeControls`.

Os contextos do cubo criam instâncias por sessão; os handlers de teclado permanecem estáveis entre movimentos. Tipos antigos, CSS vazio e dependências sem uso foram removidos. Use npm e `package-lock.json`.

## Verificação

```sh
npm run typecheck
npm run lint
npm run format:check
npm run test:ci
npm run build
npm run test:e2e
```

Instale o navegador antes da primeira execução: `npx playwright install chromium`. A suíte padrão usa respostas de API controladas para verificar a interface sem exigir MySQL. O Playwright inicia o preview na porta `4173`.

Para testar contra o backend real, configure um MySQL exclusivo cujo nome termine em `_test`, informe as variáveis `DATABASE_*` e execute `npm run test:serve` em `back-end`. Aguarde `FULLSTACK TEST READY`. Esse servidor gera chaves de teste, importa os tutoriais e usa a porta `1340` por padrão. Em `front-end`, defina `REACT_APP_STRAPI_URL=http://127.0.0.1:1340` antes de gerar o build e `STRAPI_E2E_URL=http://127.0.0.1:1340` antes de executar o Playwright. Sem `STRAPI_E2E_URL`, os cenários reais são ignorados.

Os cenários reais criam contas e dados no banco de testes. O workflow `fullstack-quality.yml` automatiza o processo com um MySQL descartável.
