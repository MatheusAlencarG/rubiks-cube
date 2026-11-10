export default {
  routes: [
    {
      method: 'GET',
      path: '/ranking',
      handler: 'api::ranking.ranking.list',
      config: { auth: false },
    },
  ],
};
