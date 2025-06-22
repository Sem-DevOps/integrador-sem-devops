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

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "${var.project_name}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Subnet
resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

# Public IP para Frontend - COMENTADO: Ahora usamos Static Web Apps
/*
resource "azurerm_public_ip" "frontend" {
  name                = "${var.project_name}-frontend-ip"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  allocation_method   = "Static"
  sku                = "Standard"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "frontend"
  }
}
*/

# Public IP para Backend
resource "azurerm_public_ip" "backend" {
  name                = "${var.project_name}-backend-ip"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  allocation_method   = "Static"
  sku                = "Standard"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "backend"
  }
}

# Security Group
resource "azurerm_network_security_group" "main" {
  name                = "${var.project_name}-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTP"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTPS"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "NodeJS"
    priority                   = 1004
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Network Interface para Frontend - COMENTADO: Ahora usamos Static Web Apps
/*
resource "azurerm_network_interface" "frontend" {
  name                = "${var.project_name}-frontend-nic"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.frontend.id
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "frontend"
  }
}
*/

# Network Interface para Backend
resource "azurerm_network_interface" "backend" {
  name                = "${var.project_name}-backend-nic"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.backend.id
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "backend"
  }
}

# Asociar Security Group a las NICs - Frontend COMENTADO: Ahora usamos Static Web Apps
/*
resource "azurerm_network_interface_security_group_association" "frontend" {
  network_interface_id      = azurerm_network_interface.frontend.id
  network_security_group_id = azurerm_network_security_group.main.id
}
*/

resource "azurerm_network_interface_security_group_association" "backend" {
  network_interface_id      = azurerm_network_interface.backend.id
  network_security_group_id = azurerm_network_security_group.main.id
}

# VM para Frontend con auto-setup - COMENTADO: Ahora usamos Static Web Apps
/*
resource "azurerm_linux_virtual_machine" "frontend" {
  name                = "${var.project_name}-frontend-vm"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  size                = "Standard_B1s"  # Usa familia Bsv2 que tienes disponible
  admin_username      = "azureuser"

  disable_password_authentication = true

  network_interface_ids = [
    azurerm_network_interface.frontend.id,
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  # Script de inicialización automática
  custom_data = base64encode(templatefile("${path.module}/scripts/frontend-setup.sh", {
    repo_url = var.github_repo_url
    backend_ip = azurerm_public_ip.backend.ip_address
  }))

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "frontend"
  }
}
*/

# VM para Backend con auto-setup
resource "azurerm_linux_virtual_machine" "backend" {
  name                = "${var.project_name}-backend-vm"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  size                = "Standard_B1s"  # Usa familia Bsv2 que tienes disponible
  admin_username      = "azureuser"

  disable_password_authentication = true

  network_interface_ids = [
    azurerm_network_interface.backend.id,
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  # Script de inicialización automática
  custom_data = base64encode(templatefile("${path.module}/scripts/backend-setup.sh", {
    repo_url = var.github_repo_url
    mysql_host = azurerm_mysql_flexible_server.main.fqdn
    mysql_user = var.mysql_admin_username
    mysql_password = var.mysql_admin_password != "" ? var.mysql_admin_password : random_password.mysql_password[0].result
    mysql_database = azurerm_mysql_flexible_database.main.name
  }))

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "backend"
  }
}

# MySQL Flexible Server
resource "azurerm_mysql_flexible_server" "main" {
  name                = "${var.project_name}-mysql"
  location            = azurerm_resource_group.main.location
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

# Azure Static Web Apps para el Frontend
resource "azurerm_static_site" "frontend" {
  name                = "${var.project_name}-frontend"
  resource_group_name = azurerm_resource_group.main.name
  location            = "East US 2"  # Static Web Apps solo disponible en ciertas regiones
  sku_tier           = "Free"
  sku_size           = "Free"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Component   = "frontend"
  }
}