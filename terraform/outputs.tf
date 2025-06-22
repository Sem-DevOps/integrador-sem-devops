# Outputs para información importante después del deployment

output "resource_group_name" {
  description = "Nombre del Resource Group creado"
  value       = azurerm_resource_group.main.name
}

# Azure Container Apps backend URL
output "backend_container_url" {
  description = "URL HTTPS del backend (Azure Container Apps)"
  value       = "https://${azurerm_container_app.backend.latest_revision_fqdn}"
}

# Azure Container Registry
output "container_registry_url" {
  description = "URL del Azure Container Registry"
  value       = azurerm_container_registry.main.login_server
}

output "mysql_server_fqdn" {
  description = "FQDN del servidor MySQL"
  value       = azurerm_mysql_flexible_server.main.fqdn
}

output "mysql_database_name" {
  description = "Nombre de la base de datos MySQL"
  value       = azurerm_mysql_flexible_database.main.name
}

output "mysql_admin_username" {
  description = "Username del administrador MySQL"
  value       = var.mysql_admin_username
  sensitive   = true
}

output "mysql_admin_password" {
  description = "Password del administrador MySQL"
  value       = var.mysql_admin_password != "" ? var.mysql_admin_password : random_password.mysql_password[0].result
  sensitive   = true
}

# Static Web Apps outputs
output "static_web_app_url" {
  description = "URL de la aplicación estática (frontend)"
  value       = var.custom_domain_name != "" ? "https://${var.custom_domain_name}" : "https://${azurerm_static_web_app.frontend.default_host_name}"
}

output "static_web_app_default_url" {
  description = "URL por defecto de Azure Static Web Apps"
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
}

output "static_web_app_api_key" {
  description = "API key para deploy en Static Web Apps"
  value       = azurerm_static_web_app.frontend.api_key
  sensitive   = true
}

# Monitoring outputs
output "application_insights_connection_string" {
  description = "Application Insights Connection String"
  value       = azurerm_application_insights.main.connection_string
  sensitive   = true
}

output "application_insights_instrumentation_key" {
  description = "Application Insights Instrumentation Key"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "log_analytics_workspace_id" {
  description = "Log Analytics Workspace ID"
  value       = azurerm_log_analytics_workspace.main.id
}

