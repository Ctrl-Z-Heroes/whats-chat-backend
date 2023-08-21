cd ./aks-acr/
terraform destroy -auto-approve

cd ..
cd ./dnszone/
terraform destroy -auto-approve
