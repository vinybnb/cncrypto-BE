module.exports = {
  apps: [
    {
      name: 'CNCrypto',
      script: '/usr/local/bin/yarn',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      interpreter: '/bin/bash',
      autorestart: true,
      max_memory_restart: '500M',
    },
  ],
}
