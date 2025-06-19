FROM nginx:alpine

# Eliminar el contenido de prueba predeterminado de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar todos los archivos del proyecto al directorio de trabajo de nginx
COPY . /usr/share/nginx/html/

# Excluir archivos de Docker del directorio web
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/docker-compose.yml /usr/share/nginx/html/nginx.conf

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Establecer permisos adecuados
RUN chown -R nginx:nginx /usr/share/nginx/html

# Puerto expuesto
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]