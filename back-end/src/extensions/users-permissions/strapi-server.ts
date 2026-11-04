export default plugin => {
  Object.assign(plugin.contentTypes.user.schema.attributes, {
    firstName: { type: 'string', maxLength: 80 },
    lastName: { type: 'string', maxLength: 80 },
    avatar: { type: 'media', multiple: false, allowedTypes: ['images'] },
    userSettings: {
      type: 'relation',
      relation: 'oneToOne',
      target: 'api::user-setting.user-setting',
      mappedBy: 'user',
    },
    cubePresets: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::cube-preset.cube-preset',
      mappedBy: 'user',
    },
    solveAttempts: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::solve-attempt.solve-attempt',
      mappedBy: 'user',
    },
    savedGames: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::saved-game.saved-game',
      mappedBy: 'user',
    },
  });
  return plugin;
};
