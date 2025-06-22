# Guía de Monitoreo - Tienda de Mate

## 7. Monitoreo (Requerimiento Opcional) ✅

El proyecto implementa un sistema de monitoreo completo usando **Azure Application Insights** integrado con **Log Analytics**, proporcionando observabilidad completa de la aplicación en producción.

## Arquitectura de Monitoreo

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│ Static Web Apps │    │ Container Apps  │    │ MySQL Flexible  │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼──────────────┐
                    │    Application Insights    │
                    │   + Log Analytics          │
                    │                            │
                    │  • Logs automáticos        │
                    │  • Métricas de performance │
                    │  • Trazabilidad de errores │
                    │  • Dashboards personalizados │
                    └────────────────────────────┘
```

## Componentes de Monitoreo

### 1. Application Insights
- **Logs automáticos** de todas las requests HTTP
- **Métricas de performance** (tiempo de respuesta, throughput)
- **Tracking de errores** y excepciones
- **Dependencias** (conexiones a base de datos)
- **Métricas personalizadas**

### 2. Log Analytics Workspace
- **Almacenamiento centralizado** de logs
- **Queries KQL** para análisis avanzado
- **Retención de 30 días** de datos
- **Alertas automáticas**

### 3. Azure Container Apps Metrics
- **CPU y Memory usage**
- **Número de réplicas activas**
- **Network metrics**
- **Container health status**

## URLs de Acceso al Monitoreo

### Application Insights Dashboard
```
https://portal.azure.com/#@15db442d-c659-47c1-981f-97f6add9ee35/resource/subscriptions/dd68636f-9c25-4acf-9b9c-0cedbb9c8790/resourceGroups/rg-tienda-mate-prod/providers/microsoft.insights/components/tienda-mate-insights
```

### Log Analytics Workspace
```
https://portal.azure.com/#@15db442d-c659-47c1-981f-97f6add9ee35/resource/subscriptions/dd68636f-9c25-4acf-9b9c-0cedbb9c8790/resourceGroups/rg-tienda-mate-prod/providers/Microsoft.OperationalInsights/workspaces/tienda-mate-logs-v2
```

## Métricas Monitoreadas

### Backend (Container Apps)
- ✅ **Request Rate**: Número de requests por minuto
- ✅ **Response Time**: Tiempo promedio de respuesta
- ✅ **Error Rate**: Porcentaje de errores HTTP (4xx, 5xx)
- ✅ **CPU Usage**: Uso de CPU del contenedor
- ✅ **Memory Usage**: Uso de memoria del contenedor
- ✅ **Database Connections**: Conexiones activas a MySQL
- ✅ **Exception Tracking**: Errores y stack traces automáticos

### Frontend (Static Web Apps)
- ✅ **Page Views**: Visualizaciones de página
- ✅ **Load Time**: Tiempo de carga del frontend
- ✅ **User Sessions**: Sesiones de usuarios activos
- ✅ **Geographic Distribution**: Localización de usuarios

### Base de Datos (MySQL)
- ✅ **Connection Pool**: Estado del pool de conexiones
- ✅ **Query Performance**: Rendimiento de queries SQL
- ✅ **Database Health**: Estado de la base de datos

## Comandos para Acceder a Logs

### Logs en Tiempo Real
```bash
# Logs del Container Apps
az containerapp logs show \
  --name tienda-mate-backend \
  --resource-group rg-tienda-mate-prod \
  --follow

# Logs de Application Insights (última hora)
az monitor app-insights query \
  --app tienda-mate-insights \
  --resource-group rg-tienda-mate-prod \
  --analytics-query "traces | where timestamp > ago(1h) | order by timestamp desc"
```

### Métricas de Performance
```bash
# CPU y memoria del Container App
az monitor metrics list \
  --resource "/subscriptions/dd68636f-9c25-4acf-9b9c-0cedbb9c8790/resourceGroups/rg-tienda-mate-prod/providers/Microsoft.App/containerApps/tienda-mate-backend" \
  --metric "CpuPercentage,MemoryPercentage" \
  --interval PT1M

# Requests HTTP
az monitor app-insights metrics show \
  --app tienda-mate-insights \
  --resource-group rg-tienda-mate-prod \
  --metric requests/count \
  --interval PT1H
```

### Queries Útiles en Log Analytics (KQL)

```kql
// Top 10 requests más lentos
requests
| where timestamp > ago(1h)
| top 10 by duration desc
| project timestamp, name, url, duration, resultCode

// Errores en la última hora
exceptions
| where timestamp > ago(1h)
| summarize count() by type, outerMessage
| order by count_ desc

// Performance de base de datos
dependencies
| where type == "SQL"
| where timestamp > ago(1h)
| summarize avg(duration), count() by name
| order by avg_duration desc

// Rate de requests por minuto
requests
| where timestamp > ago(1h)
| summarize count() by bin(timestamp, 1m)
| render timechart
```

## Alertas Configuradas

### Automáticas (por defecto)
- 🚨 **High Error Rate**: >5% de errores HTTP en 5 minutos
- 🚨 **Slow Response Time**: >2 segundos promedio en 5 minutos
- 🚨 **High CPU Usage**: >80% CPU por más de 10 minutos
- 🚨 **Memory Pressure**: >90% memoria por más de 5 minutos
- 🚨 **Database Connection Failures**: Fallos de conexión a MySQL

### Configurar Alertas Personalizadas
```bash
# Crear alerta para errores de API
az monitor metrics alert create \
  --name "API-Error-Rate-High" \
  --resource-group rg-tienda-mate-prod \
  --scopes "/subscriptions/dd68636f-9c25-4acf-9b9c-0cedbb9c8790/resourceGroups/rg-tienda-mate-prod/providers/microsoft.insights/components/tienda-mate-insights" \
  --condition "count requests/failed > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --severity 2
```

## Dashboard Personalizado

### Widgets Incluidos
1. **Request Volume**: Gráfico de líneas con requests/minuto
2. **Response Time**: Percentiles P50, P95, P99
3. **Error Rate**: Porcentaje de errores por código HTTP
4. **Geographic Map**: Mapa de usuarios por ubicación
5. **Database Performance**: Tiempo de queries SQL
6. **Container Resources**: CPU y memoria en tiempo real

### Acceso al Dashboard
```
Azure Portal → Application Insights → tienda-mate-insights → Overview
```

## Métricas de Negocio

### KPIs Monitoreados
- 📊 **Formularios enviados**: Total por tipo (contacto, trabajo, franquicias)
- 📊 **Tasa de conversión**: Porcentaje de formularios completados
- 📊 **Uploads de CV**: Número de archivos subidos exitosamente
- 📊 **Newsletter signups**: Suscripciones al newsletter
- 📊 **User engagement**: Tiempo promedio en el sitio

### Custom Events en el Backend
```javascript
// Ejemplo de eventos personalizados que ya están implementados
const appInsights = require('applicationinsights');

// Trackear formulario de contacto
appInsights.defaultClient.trackEvent({
    name: "FormSubmission",
    properties: {
        formType: "contacto",
        success: true
    }
});

// Trackear upload de CV
appInsights.defaultClient.trackEvent({
    name: "FileUpload",
    properties: {
        fileType: "cv",
        fileSize: fileSize,
        success: true
    }
});
```


## Beneficios Implementados

✅ **Observabilidad completa** de toda la aplicación
✅ **Detección proactiva** de problemas antes que afecten usuarios
✅ **Performance optimization** basado en métricas reales
✅ **Troubleshooting rápido** con logs correlacionados
✅ **Business intelligence** con métricas de uso
✅ **Zero configuration** - funciona automáticamente
✅ **Escalabilidad** automática basada en métricas

