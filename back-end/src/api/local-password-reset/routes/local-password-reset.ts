export default {
  routes: [
    {
      method: 'GET',
      path: '/local-password-reset',
      handler: 'local-password-reset.status',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/local-password-reset',
      handler: 'local-password-reset.reset',
      config: { auth: false },
    },
  ],
};
