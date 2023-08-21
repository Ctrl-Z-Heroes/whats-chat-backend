cd ./aks-acr/
terraform init -upgrade
terraform apply -auto-approve

cd ..

cd ./dnszone/
terraform init -upgrade
terraform apply -auto-approve
