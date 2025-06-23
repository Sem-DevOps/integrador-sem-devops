# Trabajo Práctico Integrador de DevOps - Tienda de Mate

## Descripción del Proyecto

Este proyecto implementa una aplicación web completa de una tienda de mate desplegada en Azure Cloud, aplicando las prácticas y herramientas de DevOps modernas. La aplicación incluye frontend React, backend Node.js con API REST, base de datos MySQL y está completamente containerizada con pipeline de CI/CD automatizado.

## Tecnologías Utilizadas

**Frontend:**
- React 18 + Vite
- CSS3 con diseño responsive
- Formularios interactivos

**Backend:**
- Node.js con Express.js
- API REST completa
- Manejo de archivos con Multer
- Migraciones automáticas de base de datos

**Base de Datos:**
- Azure MySQL Flexible Server
- Tablas para contactos, solicitudes de trabajo, franquicias y newsletter

**Cloud & DevOps:**
- **Azure Container Apps** (Backend)
- **Azure Static Web Apps** (Frontend)
- **Cloudflare Workers** (Dominio personalizado)
- **Terraform** (Infrastructure as Code)
- **GitHub Actions** (CI/CD)
- **Docker** (Containerización)
- **Tests automatizados** con Jest

## Estructura del Proyecto

```
├── frontend-react/     # Frontend React + Vite
├── backend/           # API Node.js + Express
├── database/          # Scripts SQL
├── terraform/         # Infrastructure as Code
├── .github/workflows/ # Pipeline CI/CD
├── docker-compose.yml # Desarrollo local
├── DEPLOYMENT-GUIDE.md # Guía completa de deployment
└── README.md         # Documentación
```

## 🚀 Links Importantes

- **📖 Guía Completa de Deployment**: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- **📊 Guía de Monitoreo**: [MONITORING.md](./MONITORING.md)
- **🌐 Aplicación Live**: https://tienda-mate.devoperations-it.workers.dev/
- **🔧 Backend API**: https://tienda-mate-backend.azurecontainerapps.io
- **🚀 Pipeline CI/CD**: [GitHub Actions](./.github/workflows/frontend-deploy.yml)
- **📈 Application Insights**: Azure Portal → Application Insights → tienda-mate-insights

## Cumplimiento de Requisitos

### 1. Desarrollo de la aplicación ✓
- **Backend:** Node.js con Express desplegado en Azure Container Apps
- **Frontend:** React con Vite desplegado en Azure Static Web Apps
- **Base de datos:** Azure MySQL Flexible Server con 4 tablas relacionales
- **Funcionalidad:** Formularios de contacto, trabajo, franquicias y newsletter
- **Dominio personalizado:** Cloudflare Workers como proxy

### 2. Control de versiones con Git ✓
- Repositorio en GitHub con historial completo
- Estructura de branches organizada
- Commits descriptivos y documentados
- Tags de versiones

### 3. Containerización ✓
- **Backend Dockerfile:** Imagen Node.js optimizada
- **Frontend Dockerfile:** Imagen Nginx para desarrollo local
- **docker-compose.yml:** Orquestación completa para desarrollo
- **Azure Container Apps:** Deployment serverless en cloud

### 4. Automatización de tests ✓
- Tests unitarios con Jest
- Tests de integración para endpoints API
- Mocks de base de datos para testing
- Pipeline automático ejecuta tests en cada push

### 5. CI/CD ✓
- **GitHub Actions** con pipeline completo
- **Build:** Construye y sube imágenes Docker a Azure Container Registry
- **Tests:** Ejecuta suite completa automáticamente
- **Deploy:** Deployment automático a Azure Container Apps y Static Web Apps
- **Environments:** Producción funcionando con deployment automático

### 6. Infrastructure as Code ✓
- **Terraform:** Infraestructura completamente definida como código
- **Azure Provider:** Gestión de recursos cloud
- **State Management:** Estado de infraestructura versionado
- **Outputs:** Variables automáticas para CI/CD

### 7. Cloud Deployment ✓
- **Aplicación funcionando en producción**
- **Alta disponibilidad** con Azure Container Apps
- **SSL automático** y dominio personalizado
- **Escalabilidad** automática basada en demanda

### 8. Monitoreo ✓
- **Azure Application Insights** integrado
- **Logs automáticos** de toda la aplicación
- **Métricas de performance** en tiempo real
- **Alertas proactivas** para errores y performance
- **Dashboards personalizados** con KPIs de negocio
- **Trazabilidad completa** de requests y errores
- **Log Analytics** para queries avanzadas

## Instrucciones para Desarrollo Local

### Con Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/Sem-DevOps/integrador-sem-devops
cd integrador-sem-devops

# Levantar servicios
docker-compose up --build

# Acceder a:
# Frontend: http://localhost:5173  (React + Vite)
# Backend: http://localhost:3000
# MySQL: localhost:3307
```

### Sin Docker

```bash
# Backend
cd backend
npm install
npm start

# Frontend React
cd frontend-react
npm install
npm run dev
```

### Variables de entorno

Archivo `.env` en carpeta backend:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=tienda_mate
DB_PORT=3307
PORT=3000
NODE_ENV=development
```

Archivo `.env.local` en carpeta frontend-react:
```env
VITE_API_URL=http://localhost:3000
```

## Tests

```bash
cd backend
npm test              # Ejecutar tests
npm run test:coverage # Con reporte coverage
```

## Endpoints API

**Base URL**: Obtener desde el portal de Azure 

- `GET /` - Health check API
- `POST /api/contacto` - Enviar mensaje de contacto
- `POST /api/trabajo` - Solicitud de trabajo (con upload de CV)
- `POST /api/franquicias` - Consulta franquicia
- `POST /api/newsletter` - Suscripción newsletter

## Pipeline DevOps

El pipeline de GitHub Actions se ejecuta automáticamente en cada push a `main`:

### Backend Pipeline:
1. **Checkout** código
2. **Login** a Azure
3. **Build** imagen Docker del backend
4. **Push** a Azure Container Registry
5. **Deploy** a Azure Container Apps

### Frontend Pipeline:
1. **Checkout** código
2. **Build** aplicación React
3. **Deploy** a Azure Static Web Apps
4. **Environment variables** inyectadas automáticamente

## Arquitectura Cloud

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Cloudflare     │    │  Azure Static   │    │  Azure Container│
│  Workers        │◄──►│  Web Apps       │    │  Apps (Backend) │
│  (Proxy)        │    │  (Frontend)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         │              ┌─────────────────┐            │
         └──────────────►│  Azure MySQL    │◄───────────┘
                        │  Flexible       │
                        │  Server         │
                        └─────────────────┘
```

## Pasos Manuales Requeridos

**⚠️ Importante**: Algunos pasos requieren intervención manual debido a limitaciones de la cuenta de estudiante de Azure:

1. **Inicialización de base de datos**: Ejecutar `init.sql` manualmente
2. **Primera imagen Docker**: Subir imagen inicial del backend
3. **Configuración de Cloudflare Workers**: Setup del proxy para dominio personalizado
4. **Secretos de GitHub**: Configuración manual de credenciales

Ver [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) para instrucciones detalladas.

## Monitoreo y Logs

```bash
# Logs del backend en tiempo real
az containerapp logs show --name tienda-mate-backend --resource-group rg-tienda-mate-prod --follow

# Métricas de Azure Container Apps
az monitor metrics list --resource tienda-mate-backend
```

## Autor

Proyecto desarrollado para el Trabajo Práctico Integrador de DevOps.
Ciro villasanti y Ailín Ojeda Pytel
