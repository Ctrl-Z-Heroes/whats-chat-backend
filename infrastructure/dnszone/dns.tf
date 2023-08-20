resource "random_pet" "rg_name" {
  prefix = var.resource_group_name_prefix
}

resource "azurerm_resource_group" "rg_dns" {
  name     = random_pet.rg_name.id
  location = var.resource_group_location
}

resource "random_string" "azurerm_dns_zone_name" {
  length  = 13
  lower   = true
  numeric = false
  special = false
  upper   = false
}

resource "azurerm_dns_zone" "zone" {
  name = (
    var.dns_zone_name != null ?
    var.dns_zone_name :
    "kubetown.co.uk"
  )
  resource_group_name = azurerm_resource_group.rg_dns.name
}

resource "azurerm_dns_cname_record" "record" {
  name                = "sample"
  resource_group_name = azurerm_resource_group.rg_dns.name
  zone_name           = azurerm_dns_zone.zone.name
  ttl                 = var.dns_ttl
  record              = "sample-lb.westeurope.cloudapp.azure.com"
}
