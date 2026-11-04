export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwt: { expiresIn: '7d' },
      register: { allowedFields: ['firstName', 'lastName'] },
    },
  },
  upload: { config: { sizeLimit: 10 * 1024 * 1024 } },
});
