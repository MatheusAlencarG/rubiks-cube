const auth = { scope: ['plugin::users-permissions.user.me'] };

export default {
  routes: [
    { method: 'GET', path: '/account/profile', handler: 'account.profile', config: { auth } },
    { method: 'PUT', path: '/account/profile', handler: 'account.updateProfile', config: { auth } },
  ],
};
