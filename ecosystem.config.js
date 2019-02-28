module.exports = {
  apps: [
    {
      script: 'json-server',
      cwd: './api',
      args: 'quiz-data.json',

      watch: false,
      max_restarts: 4,

      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }, 
    {
      script: 'quasar',
      cwd: './designer',
      args: 'dev',

      watch: false,
      max_restarts: 4,

      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }

  ],
};
