variable "resource_group_name" {
  type        = string
  description = "RG name in Azure"
}

variable "location" {
  type        = string
  description = "Resources location in Azure"
}

variable "cluster_name" {
  type        = string
  description = "AKS name in Azure"
}

variable "kubernetes_version" {
  type        = string
  description = "Kubernetes version"
}

variable "system_node_count" {
  type        = number
  description = "Number of AKS worker nodes"
}

variable "acr_name" {
  type        = string
  description = "ACR name"
}

variable "resource_group_location" {
  type        = string
  default     = "westeurope"
  description = "Location for all resources."
}

variable "resource_group_name_prefix" {
  type        = string
  default     = "rg"
  description = "Prefix of the resource group name that's combined with a random value so name is unique in your Azure subscription."
}

variable "dns_zone_name" {
  type        = string
  default     = null
  description = "Name of the DNS zone."
}

variable "dns_ttl" {
  type        = number
  default     = 3600
  description = "Time To Live (TTL) of the DNS record (in seconds)."
}

variable "dns_records" {
  type        = list(string)
  default     = ["1.2.3.4", "1.2.3.5"]
  description = "List of IPv4 addresses."
}

