terraform init
terraform apply

resource_group_name=$(terraform output -raw resource_group_name)
kubernetes_cluster_name=$(terraform output -raw kubernetes_cluster_name)

az aks get-credentials --resource-group $resource_group_name --name $kubernetes_cluster_name

