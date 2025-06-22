# Azure Provider Variables
variable "azure_subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  sensitive   = true
}

variable "azure_client_id" {
  description = "Azure Client ID (App ID del Service Principal)"
  type        = string
  sensitive   = true
}

variable "azure_client_secret" {
  description = "Azure Client Secret (Password del Service Principal)"
  type        = string
  sensitive   = true
}

variable "azure_tenant_id" {
  description = "Azure Tenant ID"
  type        = string
  sensitive   = true
}

# Project Variables
variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "tienda-mate"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "resource_name_base" {
  description = "Nombre del Resource Group"
  type        = string
  default     = "rg-tienda-mate-prod"
}

# SSH Variables
variable "ssh_public_key" {
  description = "SSH Public Key para acceso a las VMs"
  type        = string
}

# GitHub Repository
variable "github_repo_url" {
  description = "URL del repositorio GitHub"
  type        = string
  default     = "https://github.com/Sem-DevOps/integrador-sem-devops"
}

# Database Variables
variable "mysql_admin_username" {
  description = "Username del administrador de MySQL"
  type        = string
  default     = "mateadmin"
}

variable "mysql_admin_password" {
  description = "Password del administrador de MySQL"
  type        = string
  sensitive   = true
  default     = ""
}

variable "mysql_sku_name" {
  description = "SKU de Azure Database for MySQL Flexible Server"
  type        = string
  default     = "B_Standard_B1s"
}

variable "mysql_storage_gb" {
  description = "Storage en GB para MySQL Flexible Server"
  type        = number
  default     = 20
}

variable "custom_domain_name" {
  description = "Nombre de dominio personalizado (opcional). Ej: 'tienda-mate.com'"
  type        = string
  default     = ""
}