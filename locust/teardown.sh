
az container delete --resource-group $DEPLOY_RG --name nodedep-loadtest-master -y

for i in "01" "02" "03" "04"; do 
    echo "Tearing down $i"
    az container delete --resource-group $DEPLOY_RG --name nodedep-loadtest-worker-${i} -y
done
