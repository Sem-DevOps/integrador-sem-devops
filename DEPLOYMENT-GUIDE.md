# Guía de Deployment en Azure - Tienda de Mate

## Arquitectura Final

- **Frontend**: Azure Static Web Apps + Cloudflare Workers Proxy
- **Backend**: Azure Container Apps
- **Base de datos**: Azure MySQL Flexible Server
- **CI/CD**: GitHub Actions
- **Acceso desde internet**: https://tienda-mate.devoperations-it.workers.dev/

## Pre-requisitos

1. **Cuenta de Azure** (suscripción de estudiante funciona)
2. **Cuenta de GitHub** con repositorio
3. **Terraform instalado** en tu máquina local
4. **Azure CLI instalado** en tu máquina local
5. **Docker instalado** 
6. **Cuenta de Cloudflare** (gratuita) opcional si deseas personalizar la url del frontend

## Paso 1: Configuración de Azure Service Principal

### 1.1 Crear Service Principal

```bash
# Login a Azure
az login

# Crear service principal
az ad sp create-for-rbac --name "terraform-devops" --role contributor --scopes /subscriptions/TU_SUBSCRIPTION_ID

# Guardar el output - se requiere para completar para terraform.tfvars
```

### 1.2 Obtener IDs necesarios

```bash
# Obtener subscription ID
az account show --query id -o tsv

# Obtener tenant ID  
az account show --query tenantId -o tsv
```

## Paso 2: Configuración de Terraform

### 2.1 Crear terraform.tfvars

Crear archivo `terraform/terraform.tfvars` con:

```hcl
# Azure Service Principal (del paso anterior)
azure_subscription_id = "tu-subscription-id"
azure_tenant_id       = "tu-tenant-id"
azure_client_id       = "tu-client-id"          
azure_client_secret   = "tu-client-secret"       

# Configuración del proyecto
project_name        = "tienda-mate"
environment         = "prod"
location           = "East US"
resource_group_name = "rg-tienda-mate-prod"

# Database settings
mysql_admin_username = "mateadmin"
mysql_admin_password = "admin123!" 

# SSH Key (generar con ssh-keygen si no tienes)
ssh_public_key = "tu-ssh-public-key"
github_repo_url = "https://github.com/tu-usuario/tu-repo"

# Custom domain (dejarlo vacío por ahora)
custom_domain_name = ""
```

### 2.2 Crear directorio de database

```bash
# Desde la raíz del proyecto
mkdir -p database
cp backend/src/migrations/init.sql database/init.sql
```

### 2.3 Deploy con Terraform

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Paso 3: Inicialización Manual de Base de Datos

**⚠️ PASO MANUAL REQUERIDO**: Terraform no puede ejecutar automáticamente el init.sql debido a limitaciones de la cuenta de estudiante.

### 3.1 Instalar extensión de Azure CLI

```bash
az extension add --name rdbms-connect
```

### 3.2 Ejecutar init.sql

```bash
# Opción 1: Con Azure CLI
az mysql flexible-server execute \
  --name tienda-mate-mysql-v2 \
  --resource-group rg-tienda-mate-prod \
  --admin-user mateadmin \
  --admin-password 'admin123!' \
  --database-name tienda_mate \
  --file-path database/init.sql

# Opción 2: Con cliente MySQL (si tienes instalado)
mysql -h tienda-mate-mysql-v2.mysql.database.azure.com \
  -u mateadmin -padmin123! tienda_mate < database/init.sql
```

### 3.3 Verificar tablas creadas

```bash
az mysql flexible-server execute \
  --name tienda-mate-mysql-v2 \
  --resource-group rg-tienda-mate-prod \
  --admin-user mateadmin \
  --admin-password 'admin123!' \
  --database-name tienda_mate \
  --querytext "SHOW TABLES;"
```

## Paso 4: Configuración de GitHub Actions

### 4.1 Obtener valores de Azure

```bash
cd terraform

# Obtener Container Registry URL
terraform output container_registry_url

# Obtener credenciales del Container Registry
az acr credential show --name tiendamateacrv2 --resource-group rg-tienda-mate-prod

# Obtener Static Web Apps API Token
terraform output static_web_app_api_key

# Obtener URL del backend
terraform output backend_container_url
```

### 4.2 Configurar Secretos en GitHub

Ve a **GitHub → Settings → Secrets and variables → Actions**

**Secrets** (New repository secret):
```
AZURE_CREDENTIALS = {
  "clientId": "tu-client-id",
  "clientSecret": "tu-client-secret", 
  "subscriptionId": "tu-subscription-id",
  "tenantId": "tu-tenant-id"
}

REGISTRY_USERNAME = [del output de az acr credential]
REGISTRY_PASSWORD = [del output de az acr credential]
AZURE_STATIC_WEB_APPS_API_TOKEN = [del terraform output]
```

**Variables** (Variables tab):
```
CONTAINER_REGISTRY_URL = tiendamateacrv2.azurecr.io
RESOURCE_GROUP_NAME = rg-tienda-mate-prod
BACKEND_API_URL = [URL del backend de terraform output]
```

## Paso 5: Deployment Manual Inicial del Backend

**⚠️ PASO MANUAL REQUERIDO**: El Container App se crea con imagen temporal. Se requiere subir la imagen real la primera vez.

### 5.1 Construir y subir imagen del backend

```bash
# Login al Container Registry
docker login tiendamateacrv2.azurecr.io -u [username] -p [password]

# Construir imagen
cd backend
docker build -t tiendamateacrv2.azurecr.io/tienda-mate-backend:latest .

# Subir imagen
docker push tiendamateacrv2.azurecr.io/tienda-mate-backend:latest
```

### 5.2 Actualizar Container App

```bash
az containerapp update \
  --name tienda-mate-backend \
  --resource-group rg-tienda-mate-prod \
  --image tiendamateacrv2.azurecr.io/tienda-mate-backend:latest
```

### 5.3 Verificar logs

```bash
az containerapp logs show \
  --name tienda-mate-backend \
  --resource-group rg-tienda-mate-prod \
  --follow
```

## Paso 6: Configuración de Cloudflare Workers (Dominio Personalizado)

**⚠️ PASO MANUAL REQUERIDO**: Azure Static Web Apps con cuenta de estudiante da URLs poco amigables. Podemos personalizar un poco más usando un Worker de Cloudfare.

### 6.1 Crear Worker en Cloudflare

1. Ve a [cloudflare.com](https://cloudflare.com) → Workers & Pages
2. **Create Application** → **Create Worker**
3. **Nombre**: `tienda-mate-proxy`

### 6.2 Configurar código del Worker en Cloudfare

```javascript
export default {
  async fetch(request) {
    // URL de Azure Static Web Apps (obtener con terraform output)
    const targetUrl = 'https://tu-url-de-azure-static-web-apps.azurestaticapps.net';
    
    // Crear nueva URL manteniendo el path original
    const url = new URL(request.url);
    const proxyUrl = targetUrl + url.pathname + url.search;
    
    // Copiar headers originales
    const headers = new Headers(request.headers);
    headers.set('Host', 'tu-url-de-azure-static-web-apps.azurestaticapps.net');
    
    // Hacer request al servidor real
    const response = await fetch(proxyUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });
    
    // Crear nueva response
    const newResponse = new Response(response.body, response);
    
    // Limpiar headers problemáticos
    newResponse.headers.delete('x-frame-options');
    newResponse.headers.delete('content-security-policy');
    
    return newResponse;
  },
};
```

### 6.3 Deploy y obtener URL

**Save and Deploy** → La aplicación estará en: `https://tienda-mate-proxy.tu-usuario.workers.dev`

## Paso 7: Configuración de Variables de Entorno del Frontend

### 7.1 Actualizar GitHub Actions

Actualiza la variable `BACKEND_API_URL` en GitHub → Variables con la URL real del backend:

```
BACKEND_API_URL = https://tienda-mate-backend.something.azurecontainerapps.io
```

## URLs Finales

- **Frontend**: https://tienda-mate.devoperations-it.workers.dev/
- **Backend**: https://tienda-mate-backend.[hash].azurecontainerapps.io
- **Base de datos**: tienda-mate-mysql-v2.mysql.database.azure.com

## Flujo de CI/CD Automático

Una vez configurado, cualquier push a `main` activará:

1. **Backend**: Construye nueva imagen Docker → Sube a Container Registry → Actualiza Container App
2. **Frontend**: Construye aplicación React → Sube a Static Web Apps
3. **Cloudflare Worker**: Actúa como proxy transparente para dominio amigable

## Comandos Útiles

### Monitoreo
```bash
# Logs del backend
az containerapp logs show --name tienda-mate-backend --resource-group rg-tienda-mate-prod --follow

# Estado de recursos
az resource list --resource-group rg-tienda-mate-prod --output table

# Conectar a base de datos
az mysql flexible-server connect --name tienda-mate-mysql-v2 --admin-user mateadmin
```

### Troubleshooting
```bash
# Reiniciar Container App
az containerapp revision restart --name tienda-mate-backend --resource-group rg-tienda-mate-prod

# Ver secretos del Container App
az containerapp secret list --name tienda-mate-backend --resource-group rg-tienda-mate-prod
```

### Destruir infraestructura
```bash
cd terraform
terraform destroy
```