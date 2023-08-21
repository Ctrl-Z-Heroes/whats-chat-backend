cd ./cert-manager/
bash init.sh
kubectl apply -f .

cd ../
cd ./sample 
kubectl apply -f .
