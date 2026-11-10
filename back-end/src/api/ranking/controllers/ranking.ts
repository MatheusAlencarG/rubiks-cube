import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
import { MIN_RANKED_SCRAMBLE_MOVES, TRIVIAL_STARTS } from '../../../lib/contracts';
import { isLocalDevelopmentRequest } from '../../../lib/local-request';

const rankingLimit = 100;

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async list(ctx: Context) {
    const attempts = strapi.db.metadata.get('api::solve-attempt.solve-attempt');
    const users = strapi.db.metadata.get('plugin::users-permissions.user');
    const owner = attempts.attributes.user;

    if (owner.type !== 'relation' || owner.relation !== 'manyToOne' || !owner.joinTable) {
      throw new Error('Relação de usuário das tentativas indisponível.');
    }

    const { name, joinColumn, inverseJoinColumn } = owner.joinTable;
    const { columnName } = strapi.db.metadata.naming;
    const duration = `attempt.${columnName('durationMs')}`;
    const cubeType = `attempt.${columnName('cubeType')}`;
    const db = strapi.db.getConnection();
    const query = db({ attempt: attempts.tableName })
      .join({ owner: name }, `owner.${joinColumn.name}`, `attempt.${joinColumn.referencedColumn}`)
      .join(
        { player: users.tableName },
        `player.${inverseJoinColumn.referencedColumn}`,
        `owner.${inverseJoinColumn.name}`
      )
      .where(cubeType, '3x3')
      .where('player.blocked', false);

    if (!isLocalDevelopmentRequest(ctx)) {
      const devOnly = `attempt.${columnName('devOnly')}`;
      query
        .where(builder => builder.where(devOnly, false).orWhereNull(devOnly))
        .whereRaw('JSON_LENGTH(??) >= ?', ['attempt.scramble', MIN_RANKED_SCRAMBLE_MOVES])
        .whereRaw(
          `JSON_UNQUOTE(JSON_EXTRACT(??, '$.facelets')) NOT IN (${TRIVIAL_STARTS.map(() => '?').join(', ')})`,
          [`attempt.${columnName('initialState')}`, ...TRIVIAL_STARTS]
        );
    }

    const rankedAttempts = query
      .select({ playerId: 'player.id', username: 'player.username', durationMs: duration })
      .select(db.raw('JSON_LENGTH(??) AS ??', [`attempt.${columnName('moves')}`, 'moveCount']))
      .rowNumber('attemptRank', [duration, 'attempt.id'], 'player.id');

    const players = await db
      .from(rankedAttempts.as('ranked'))
      .where('attemptRank', 1)
      .select('username', 'durationMs', 'moveCount')
      .orderBy('durationMs')
      .orderBy('username')
      .orderBy('playerId')
      .limit(rankingLimit);

    ctx.set('Cache-Control', 'no-store');
    ctx.body = {
      data: players.map(({ username, durationMs, moveCount }, index) => ({
        position: index + 1,
        username,
        durationMs: Number(durationMs),
        moveCount: Number(moveCount),
      })),
    };
  },
});
