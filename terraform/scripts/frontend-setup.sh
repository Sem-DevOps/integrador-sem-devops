#!/bin/bash

# Log todo para debugging
exec > >(tee /var/log/frontend-setup.log) 2>&1

echo "=== Iniciando configuración automática del Frontend ==="
echo "Timestamp: $(date)"

# ESPERAR A QUE LA RED ESTÉ LISTA
echo "Esperando a que la red esté disponible..."
until ping -c 1 google.com &> /dev/null; do
    echo "Red no disponible, esperando 10 segundos..."
    sleep 10
done

until ping -c 1 github.com &> /dev/null; do
    echo "GitHub no disponible, esperando 10 segundos..."
    sleep 10
done

echo "✅ Conectividad de red confirmada"

# Actualizar sistema
echo "Actualizando sistema..."
apt-get update -y
apt-get upgrade -y

# Instalar Node.js 18
echo "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar dependencias adicionales
echo "Instalando dependencias..."
apt-get install -y git nginx build-essential

# Verificar instalaciones
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Git version: $(git --version)"

# Crear directorio para la aplicación
echo "Configurando directorio de aplicación..."
mkdir -p /var/www/app
cd /var/www/app

# INTENTAR CLONE CON REINTENTOS
echo "Clonando repositorio: ${repo_url}"
clone_success=false
max_attempts=5
attempt=1

while [ $attempt -le $max_attempts ] && [ "$clone_success" = false ]; do
    echo "Intento $attempt de clonar repositorio..."
    
    if git clone ${repo_url} .; then
        clone_success=true
        echo "✅ Repositorio clonado exitosamente"
    else
        echo "❌ Falló intento $attempt, esperando 30 segundos..."
        sleep 30
        rm -rf * .*
        attempt=$((attempt + 1))
    fi
done

if [ "$clone_success" = false ]; then
    echo "❌ ERROR: No se pudo clonar el repositorio después de $max_attempts intentos"
    exit 1
fi

# Verificar que existe el directorio frontend
if [ ! -d "frontend-react" ]; then
    echo "❌ ERROR: No se encontró el directorio frontend-react"
    ls -la
    exit 1
fi

# Configurar frontend
echo "Configurando frontend..."
cd frontend-react

# Crear archivo .env para producción
cat > .env << EOF
REACT_APP_API_URL=http://${backend_ip}:3000
NODE_ENV=production
EOF

# Instalar dependencias
echo "Instalando dependencias de Node.js..."
npm install

# Build de producción
echo "Compilando aplicación React..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ] && [ ! -d "build" ]; then
    echo "❌ ERROR: Build de React falló - no se encontró directorio dist o build"
    ls -la
    exit 1
fi

# Usar build o dist según lo que haya
BUILD_DIR="dist"
if [ ! -d "dist" ] && [ -d "build" ]; then
    BUILD_DIR="build"
fi

echo "✅ Build completado, usando directorio: $BUILD_DIR"

# Configurar Nginx
echo "Configurando Nginx..."
cat > /etc/nginx/sites-available/default << EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/app/frontend-react/$BUILD_DIR;
    index index.html index.htm;

    server_name _;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://${backend_ip}:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Cambiar permisos
chown -R www-data:www-data /var/www/app
chmod -R 755 /var/www/app

# Reiniciar y habilitar Nginx
systemctl restart nginx
systemctl enable nginx

# Verificar estado
echo "Estado de Nginx: $(systemctl is-active nginx)"

# Crear script de actualización
cat > /home/azureuser/update-app.sh << 'EOF'
#!/bin/bash
cd /var/www/app
git pull origin main
cd frontend-react
npm install
npm run build
sudo systemctl reload nginx
echo "Aplicación actualizada: $(date)"
EOF

chmod +x /home/azureuser/update-app.sh
chown azureuser:azureuser /home/azureuser/update-app.sh

echo "=== Configuración del Frontend completada exitosamente ==="
echo "Aplicación disponible en: http://$(curl -s ifconfig.me)"
echo "Para actualizar la app: ./update-app.sh"
echo "Logs de Nginx: /var/log/nginx/"
echo "Timestamp: $(date)"