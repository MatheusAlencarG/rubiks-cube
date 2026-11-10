export default {
  routes: [
    {
      method: 'POST',
      path: '/solve-attempts/dev',
      handler: 'api::solve-attempt.solve-attempt.createDev',
      config: { auth: { scope: ['api::solve-attempt.solve-attempt.create'] } },
    },
  ],
};
