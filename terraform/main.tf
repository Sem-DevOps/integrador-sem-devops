# Random password para MySQL si no se proporciona
resource "random_password" "mysql_password" {
  count   = var.mysql_admin_password == "" ? 1 : 0
  length  = 16
  special = true
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_name_base
  location = var.location

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# VNet no necesaria para Container Apps - removida


# MySQL Flexible Server
resource "azurerm_mysql_flexible_server" "main" {
  name                = "${var.project_name}-mysql-v2"
  location            = "West US 2"  # Región donde funciona para estudiantes
  resource_group_name = azurerm_resource_group.main.name

  administrator_login    = var.mysql_admin_username
  administrator_password = var.mysql_admin_password != "" ? var.mysql_admin_password : random_password.mysql_password[0].result

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  
  create_mode = "Default"
  version     = "8.0.21"
  
  sku_name   = var.mysql_sku_name
  storage {
    auto_grow_enabled = true
    size_gb          = 20
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# MySQL Database
resource "azurerm_mysql_flexible_database" "main" {
  name                = "tienda_mate"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  charset             = "utf8mb4"
  collation           = "utf8mb4_unicode_ci"


  depends_on = [
    azurerm_mysql_flexible_server_firewall_rule.allow_all_ips
  ]
}

# MySQL Firewall Rule
resource "azurerm_mysql_flexible_server_firewall_rule" "azure_services" {
  name                = "AllowAzureServices"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_mysql_flexible_server_firewall_rule" "allow_all_ips" {
  name                = "AllowAllIPs"
  resource_group_name = azurerm_resource_group.main.name
  server_name         = azurerm_mysql_flexible_server.main.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}


# Azure Static Web Apps para el Frontend (nueva versión)
resource "azurerm_static_web_app" "frontend" {
  name                = "${var.project_name}-app"
  resource_group_name = azurerm_resource_group.main.name
  location            = "East US 2"
  sku_tier           = "Free"
  sku_size           = "Free"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "frontend"
  }
}


# Azure Container Registry
resource "azurerm_container_registry" "main" {
  name                = "${replace(var.project_name, "-", "")}acrv2"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  depends_on = [azurerm_resource_group.main]

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "container-registry"
  }
}

# Log Analytics Workspace (requerido para Container Apps)
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.project_name}-logs-v2"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  depends_on = [azurerm_resource_group.main]

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "logging"
  }
}

# Application Insights para monitoreo avanzado
resource "azurerm_application_insights" "main" {
  name                = "${var.project_name}-insights"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "monitoring"
  }
}

# Container Apps Environment
resource "azurerm_container_app_environment" "main" {
  name                       = "${var.project_name}-env-v2"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  depends_on = [
    azurerm_resource_group.main,
    azurerm_log_analytics_workspace.main,
    azurerm_resource_provider_registration.container_apps
  ]

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "container-environment"
  }
}

# Container App para el Backend
resource "azurerm_container_app" "backend" {
  name                         = "${var.project_name}-backend"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "backend"
      image  = "${azurerm_container_registry.main.login_server}/tienda-mate-backend:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "DB_HOST"
        value = azurerm_mysql_flexible_server.main.fqdn
      }
      env {
        name  = "DB_USER"
        value = var.mysql_admin_username
      }
      env {
        name        = "DB_PASSWORD"
        secret_name = "db-password"
      }
      env {
        name  = "DB_NAME"
        value = azurerm_mysql_flexible_database.main.name
      }
      env {
        name  = "DB_PORT"
        value = "3306"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "PORT"
        value = "3000"
      }
      env {
        name  = "APPLICATIONINSIGHTS_CONNECTION_STRING"
        value = azurerm_application_insights.main.connection_string
      }
    }

    min_replicas = 0
    max_replicas = 2
  }

  secret {
    name  = "db-password"
    value = var.mysql_admin_password != "" ? var.mysql_admin_password : random_password.mysql_password[0].result
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.main.admin_password
  }

  registry {
    server               = azurerm_container_registry.main.login_server
    username             = azurerm_container_registry.main.admin_username
    password_secret_name = "registry-password"
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "backend"
  }
}