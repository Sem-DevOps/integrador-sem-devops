#!/bin/bash
exec > >(tee /var/log/backend-setup.log) 2>&1

echo "=== Backend Setup ==="
apt-get update -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs git mysql-client
npm install -g pm2

mkdir -p /var/www/app
cd /var/www/app
git clone https://github.com/Sem-DevOps/integrador-sem-devops.git .
cd backend

# Variables de entorno
cat > .env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=${mysql_host}
DB_USER=${mysql_user}
DB_PASSWORD=${mysql_password}
DB_NAME=${mysql_database}
DB_PORT=3306
EOF

npm install --production


cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'tienda-mate-backend',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true
  }]
};
EOF

chown -R azureuser:azureuser /var/www/app
sudo -u azureuser pm2 start ecosystem.config.js
sudo -u azureuser pm2 save

echo "Backend configurado - usar npm start"