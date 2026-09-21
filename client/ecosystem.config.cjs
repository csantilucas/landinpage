module.exports = {
  apps: [
    {
      name: "web-client",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      cwd: "C:/Users/Administrador/Documents/landinpage-deploy/client",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};