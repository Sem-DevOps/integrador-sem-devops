# Trabajo Práctico Integrador de DevOps - Tienda de Mate

## Descripción del Proyecto

Este proyecto implementa una aplicación web completa de una tienda de mate, aplicando las prácticas y herramientas de DevOps solicitadas en el trabajo práctico. La aplicación incluye frontend, backend con API REST, base de datos MySQL y está completamente dockerizada con pipeline de CI/CD automatizado.

## Tecnologías Utilizadas

**Frontend:**
- HTML5, CSS3, JavaScript vanilla
- Nginx como servidor web
- Diseño responsive

**Backend:**
- Node.js con Express.js
- Conexión a base de datos MySQL
- API REST para formularios

**Base de Datos:**
- MySQL 8.0
- Tablas para contactos, solicitudes de trabajo, franquicias y newsletter

**DevOps:**
- Docker y Docker Compose
- GitHub Actions para CI/CD
- Tests automatizados con Jest

## Estructura del Proyecto

```
├── frontend/           # Sitio web HTML/CSS/JS
├── backend/           # API Node.js + Express
├── database/          # Scripts SQL
├── .github/workflows/ # Pipeline CI/CD
├── docker-compose.yml # Orquestación servicios
└── README.md         # Documentación
```

## Cumplimiento de Requisitos

### 1. Desarrollo de la aplicación ✓
- **Backend:** Node.js con Express
- **Frontend:** HTML/CSS/JS con formularios funcionales
- **Base de datos:** MySQL con 4 tablas relacionales
- **Funcionalidad:** Formularios de contacto, trabajo, franquicias y newsletter

### 2. Control de versiones con Git ✓
- Repositorio en GitHub
- Estructura de branches (main, develop)
- Commits descriptivos y organizados

### 3. Dockerización ✓
- **Dockerfile backend:** Imagen Node.js con aplicación
- **Dockerfile frontend:** Imagen Nginx sirviendo sitio estático
- **docker-compose.yml:** Orquesta frontend + backend + MySQL
- Múltiples servicios funcionando en conjunto

### 4. Automatización de tests ✓
- Tests unitarios con Jest
- Tests de integración para endpoints API
- Mocks de base de datos para testing
- Coverage de funcionalidades principales

### 5. CI/CD ✓
- **Pipeline GitHub Actions** configurado
- **Build:** Construye aplicación y imágenes Docker
- **Tests:** Ejecuta suite de tests automáticamente
- **Deploy:** Simula despliegue a producción

### 6. Documentación ✓
- README completo con instrucciones
- Documentación de endpoints API
- Guía de instalación y ejecución
- Diagramas del flujo DevOps

## Instrucciones para Ejecutar Localmente

### Con Docker (Recomendado)

```bash
# Clonar repositorio
git clone [url-repositorio]
cd integrador-sem-devops

# Levantar servicios
docker-compose up --build

# Acceder a:
# Frontend: http://localhost:8080
# Backend: http://localhost:3000
# MySQL: localhost:3307
```

### Sin Docker

```bash
# Backend
cd backend
npm install
npm start

# Frontend (servidor local)
cd frontend
python -m http.server 8080
```

## Tests

```bash
cd backend
npm test              # Ejecutar tests
npm run test:coverage # Con reporte coverage
```

## Endpoints API

- `POST /api/contacto` - Enviar mensaje de contacto
- `POST /api/trabajo` - Solicitud de trabajo
- `POST /api/franquicias` - Consulta franquicia
- `POST /api/newsletter` - Suscripción newsletter
- `GET /` - Health check API

## Pipeline DevOps

El pipeline se ejecuta automáticamente en cada push a main/develop:

1. **Tests:** Instala dependencias y ejecuta tests
2. **Build:** Construye imágenes Docker
3. **Deploy:** Simula despliegue a producción

## Variables de Entorno

Archivo `.env` en carpeta backend:
```
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=tienda_mate
PORT=3000
```

## Capturas del Pipeline

[Aquí se incluirían capturas de pantalla del pipeline ejecutándose en GitHub Actions]

## Conclusiones

Este proyecto demuestra la implementación completa de un flujo DevOps moderno:

- **Desarrollo:** Aplicación full-stack funcional
- **Contenerización:** Docker para portabilidad
- **Automatización:** CI/CD con GitHub Actions
- **Testing:** Suite de tests automatizados
- **Documentación:** Guías claras de uso

El pipeline permite despliegues seguros y automatizados, reduciendo errores manuales y mejorando la calidad del software.

## Autor

Proyecto desarrollado para el Trabajo Práctico Integrador de DevOps.