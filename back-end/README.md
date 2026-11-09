# Rubik's Cube API

Backend em **Strapi 5.60.0 + MySQL**, implementado a partir de [diagram.dbml](diagram.dbml). O servidor Fastify anterior foi removido. API e painel administrativo são servidos pelo Strapi na porta `1337` por padrão.

## Preparação

Use Node.js 22 a 26, npm e MySQL 8.0 ou superior; MySQL 8.4 é a versão definida no Docker Compose. O banco deve ser exclusivo deste Strapi: o próprio framework cria suas tabelas e relações.

Na pasta `back-end`:

```sh
npm ci
npm run setup
```

O setup cria `.env` com chaves aleatórias e senha de desenvolvimento. Se o arquivo já existir, preenche somente as chaves ausentes ou vazias, preservando credenciais e chaves já definidas. Configure os campos `DATABASE_*` para o seu MySQL. O `.env` é ignorado pelo Git.

`APP_KEYS` contém as chaves de assinatura das sessões do servidor, necessárias antes de abrir o painel. Elas são diferentes dos API Tokens criados pelo administrador. Se aparecer o erro `App keys are required`, execute `npm run setup` e reinicie o Strapi. As outras chaves privadas do servidor também são geradas pelo setup.

Se preferir iniciar um MySQL local com Docker, configure `.env` e execute:

```sh
docker compose up -d mysql
```

O Compose utiliza o nome, usuário, senha e porta definidos no `.env`, com dados em volume persistente e acesso local em `127.0.0.1`. Caso já exista MySQL na porta `3306`, escolha outra porta em `DATABASE_PORT`. Para um servidor MySQL já instalado, crie o banco e um usuário com acesso a esse banco e informe as credenciais no `.env`.

Para desenvolvimento:

```sh
npm run develop
```

- Painel: [http://localhost:1337/admin](http://localhost:1337/admin).
- API: [http://localhost:1337/api](http://localhost:1337/api), usando os endpoints abaixo.
- Verificação de disponibilidade: `GET /_health`, com resposta `204`.

Crie o primeiro administrador pelo painel. Administradores do CMS e usuários do aplicativo são contas separadas.

Para produção:

```sh
npm run build
npm start
```

Configure `PUBLIC_URL`, `CORS_ORIGINS`, as chaves privadas, TLS do MySQL quando necessário e armazenamento persistente para `public/uploads`, ou um provedor de uploads externo. O servidor usa MySQL; não há fallback silencioso para SQLite. O motor do cubo no navegador não depende de o backend estar em execução.

## Modelos e correspondência com o diagrama

| Diagrama lógico    | Implementação Strapi                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| `users`            | Extensão de `plugin::users-permissions.user` com `firstName`, `lastName` e `avatar` |
| `roles`            | Papéis nativos de Users & Permissions                                               |
| `media_files`      | Arquivos nativos da Media Library                                                   |
| `user_settings`    | Coleção `user-setting`, com relação 1:1 com usuário                                 |
| `cube_presets`     | Coleção `cube-preset`                                                               |
| `solve_attempts`   | Coleção `solve-attempt`, sem atualização após criação                               |
| `saved_games`      | Coleção `saved-game`                                                                |
| `tutorials`        | Coleção `tutorial`, com i18n e Draft & Publish                                      |
| `cube_appearances` | Componente não repetível `cube.appearance`                                          |
| `tutorial_parts`   | Componente repetível `tutorial.part`, com imagem e texto alternativo                |
| `tutorial_videos`  | Componente repetível `tutorial.video`                                               |

Os atributos da API usam camelCase: por exemplo, `duration_ms` corresponde a `durationMs`, `active_preset_id` a `activePreset` e `appearance_snapshot_id` a `appearanceSnapshot`. As relações usam identificadores de documentos na Content API, sem criar manualmente colunas de chave estrangeira.

`id`, `documentId`, datas, relações e ordem dos componentes são gerenciados pelo Strapi. O DBML é conceitual: os nomes físicos, tabelas de ligação, versões e índices serão diferentes. Não execute o SQL exportado do diagrama.

Dois detalhes de implementação preservam as regras do diagrama:

- `cubeType` mantém o valor `3x3` como string validada no backend, porque enums do Strapi não aceitam valores começando por número.
- `user-setting` possui `ownerKey`, um atributo interno, privado e único, derivado do usuário. Ele reforça a unicidade mesmo em criações concorrentes; não é aceito do cliente nem retornado pela API.

Os idiomas configurados são `pt-BR` e `en-US`, com português como padrão na primeira inicialização. O frontend converte suas chaves locais `pt-br` e `en-us` para esses valores ao consultar conteúdo e sincronizar preferências.

`user-setting` também guarda `themeMode` (`dark`, `light`, `custom`), `themeSurfaceColor`, `themeAccentColor`, `keyboardBindings` e `hintsEnabled`. No tema personalizado, `themePrimaryColor` representa o fundo da página, `themeSecondaryColor` o texto, `themeSurfaceColor` os painéis e `themeAccentColor` o destaque. Nos modos escuro e claro, o React aplica as paletas predefinidas e preserva a última paleta personalizada.

`keyboardBindings` usa as chaves `front`, `left`, `back`, `right`, `top`, `bottom`, `viewLeft`, `viewRight`, `viewUp` e `viewDown`. Os valores aceitam letras minúsculas, números ou `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, sem repetições. `hintsEnabled` é somente uma preferência para o futuro sistema de dicas, desativada por padrão. Atualizações parciais preservam os demais campos.

## Autenticação e permissões

Os endpoints nativos `POST /api/auth/local/register` e `POST /api/auth/local` fornecem o JWT dos usuários do aplicativo. A criação de conta aceita `username`, `email`, `password`, `firstName` e `lastName`. Não envie `role` ou propriedades administrativas.

Nas rotas privadas, envie `Authorization: Bearer SEU_JWT`. O proprietário vem do usuário autenticado; enviar `user`, `ownerKey` ou metadados gerenciados no objeto `data` resulta em erro.

Na primeira inicialização, o bootstrap permite leitura de tutoriais publicados ao público e acesso às coleções pessoais para usuários autenticados. Gerenciamento de outros usuários permanece desabilitado na Content API. Depois disso, alterações manuais nos papéis são preservadas entre reinicializações.

As verificações de propriedade ocorrem no backend: conhecer um `documentId` não permite consultar, editar, excluir ou vincular os registros de outra pessoa. As regras de domínio também são aplicadas por middleware do Document Service, inclusive nas edições feitas pelo painel.

## Endpoints

As respostas usam o formato do Strapi 5, com `data` e `meta`.

| Recurso                                         | Métodos                | Acesso                                     |
| ----------------------------------------------- | ---------------------- | ------------------------------------------ |
| `/api/tutorials` e `/api/tutorials/:documentId` | `GET`                  | Conteúdo publicado                         |
| `/api/account/profile`                          | `GET`, `PUT`           | Perfil da conta autenticada                |
| `/api/user-settings`                            | `GET`, `POST`          | Usuário autenticado; no máximo um registro |
| `/api/user-settings/:documentId`                | `GET`, `PUT`, `DELETE` | Proprietário                               |
| `/api/cube-presets`                             | `GET`, `POST`          | Usuário autenticado                        |
| `/api/cube-presets/:documentId`                 | `GET`, `PUT`, `DELETE` | Proprietário                               |
| `/api/solve-attempts`                           | `GET`, `POST`          | Usuário autenticado                        |
| `/api/solve-attempts/:documentId`               | `GET`, `DELETE`        | Proprietário; sem `PUT`                    |
| `/api/saved-games`                              | `GET`, `POST`          | Usuário autenticado                        |
| `/api/saved-games/:documentId`                  | `GET`, `PUT`, `DELETE` | Proprietário                               |

As listagens privadas sempre filtram pelo proprietário. A população de relações é definida pelo servidor para evitar acesso indireto a outros dados. Os tutoriais retornam partes, imagens e vídeos; solicitar `status=draft` pela Content API não expõe rascunhos.

O endpoint de perfil retorna os dados públicos da conta autenticada e a URL do `avatar`. O `PUT` aceita `username` em JSON ou um formulário multipart com `username` e uma foto no campo `files`. A foto é armazenada na biblioteca de mídia do Strapi.

Exemplo de criação de preset, no corpo de `POST /api/cube-presets`:

```json
{
  "data": {
    "name": "Padrão",
    "cubeType": "3x3",
    "appearance": {
      "widthPx": 240,
      "frontColor": "#ff0000"
    }
  }
}
```

Os demais atributos de aparência recebem os valores padrão do diagrama. Para selecionar o preset, crie ou atualize `user-settings` com `activePreset` igual ao `documentId` retornado. Esse preset deve pertencer ao usuário autenticado.

## Estados, movimentos e snapshots

O contrato de estado é:

```json
{
  "version": 1,
  "cubeType": "3x3",
  "facelets": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
}
```

As faces seguem a ordem **U, R, F, D, L, B**. Cada face tem nove posições, lidas por linhas ao olhar a face pelo lado externo. Os centros ficam fixos nessa referência; a rotação de visualização é armazenada separadamente. O backend verifica contagem de adesivos, identidade das peças, orientação e paridade, rejeitando estados fisicamente impossíveis.

O campo `engineVersion` deve ser `cubejs-1.3.2`. Os movimentos são canônicos (`U`, `R`, `F`, `D`, `L`, `B`, com `2` ou apóstrofo opcionais), com tempos relativos em milissegundos:

```json
[{ "move": "R'", "atMs": 700 }]
```

- `durationMs` é inteiro positivo; `elapsedMs` e `atMs` são inteiros não negativos.
- `atMs` deve estar em ordem e não pode ultrapassar o tempo da tentativa ou partida.
- Se `scramble` for informado, ele deve produzir o `initialState` a partir do cubo resolvido.
- Uma tentativa só é aceita se os movimentos resolverem o estado inicial.
- Em uma partida salva, `cubeState` deve corresponder ao replay. Atualizações preservam o estado inicial, motor, preset de origem, snapshot e prefixo dos movimentos; o tempo não pode diminuir.
- Quando `preset` é informado na criação, o servidor copia sua aparência para `appearanceSnapshot`. Sem preset, informe `appearanceSnapshot` diretamente; um objeto vazio aplica os padrões.
- Alterar ou excluir um preset não altera snapshots anteriores. A exclusão remove as referências ao preset, preservando os registros históricos.

O backend valida consistência do replay, mas a duração continua sendo informada pelo cliente. Isso não constitui, por si só, um mecanismo antitrapaça para rankings competitivos. O frontend serializa os movimentos e estados nesse contrato e reconstrói a aparência visual ao retomar uma partida.

## Importar os tutoriais existentes

Com MySQL e `.env` configurados, execute na pasta `back-end`:

```sh
npm run seed
```

A importação lê os JSONs e imagens de `front-end`, cria os documentos traduzidos, envia as imagens à Media Library e publica o conteúdo. Cada idioma do mesmo tutorial compartilha o `documentId`. O comando é idempotente e preserva entradas que já possuem os slugs de importação; ele não é executado automaticamente a cada inicialização.

O seed atualiza a descrição antiga e padronizada dos comandos para um texto compatível com atalhos personalizados. Isso só ocorre se o texto corresponder exatamente ao importado originalmente e as versões de rascunho e publicação forem iguais, sem partes ou vídeos adicionais. Conteúdo personalizado e rascunhos em edição são preservados.

Execute o seed a partir deste repositório completo. Para uma hospedagem que contém somente a pasta do backend, importe localmente e use as ferramentas de transferência do Strapi para levar o conteúdo ao destino.

O React consome a Content API para tutoriais e dados pessoais. Os JSONs locais são mantidos como fonte do seed e fixtures dos testes. Consulte o [guia do frontend](../front-end/README.md) para configurar a URL, autenticação e persistência do cubo.

## Qualidade e testes

```sh
npm run format
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Os testes unitários cobrem os contratos e a validade dos replays. A integração usa MySQL real e verifica autenticação, isolamento por usuário, unicidade de preferências, snapshots, imutabilidade, partidas salvas, publicação, traduções e upload de imagens.

Para a integração, configure `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME` e `DATABASE_PASSWORD` para um banco de testes exclusivo cujo nome termine em `_test`, e execute:

```sh
npm run test:integration
```

Os testes criam registros e mídias nesse banco e usam a porta `1340` por padrão (`TEST_API_PORT` permite alterar). Não aponte a integração para seu banco de desenvolvimento ou produção. O workflow de CI provisiona um MySQL 8.4 descartável para essa execução.
