# Outputs para información importante después del deployment

output "resource_group_name" {
  description = "Nombre del Resource Group creado"
  value       = azurerm_resource_group.main.name
}

# Frontend outputs - COMENTADO: Ahora usamos Static Web Apps
/*
output "frontend_public_ip" {
  description = "IP pública del frontend"
  value       = azurerm_public_ip.frontend.ip_address
}

output "frontend_url" {
  description = "URL del frontend"
  value       = "http://${azurerm_public_ip.frontend.ip_address}"
}

output "ssh_frontend" {
  description = "Comando SSH para conectar al frontend"
  value       = "ssh azureuser@${azurerm_public_ip.frontend.ip_address}"
}
*/

output "backend_public_ip" {
  description = "IP pública del backend"
  value       = azurerm_public_ip.backend.ip_address
}

output "backend_url" {
  description = "URL del backend API"
  value       = "http://${azurerm_public_ip.backend.ip_address}:3000"
}

output "ssh_backend" {
  description = "Comando SSH para conectar al backend"
  value       = "ssh azureuser@${azurerm_public_ip.backend.ip_address}"
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
  value       = "https://${azurerm_static_site.frontend.default_host_name}"
}

output "static_web_app_api_key" {
  description = "API key para deploy en Static Web Apps"
  value       = azurerm_static_site.frontend.api_key
  sensitive   = true
}