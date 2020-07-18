
for i in "01" "02"; do 
    echo "Tearing down $i"
    az container delete --resource-group $DEPLOY_RG --name nodedep-dependency-${i} -y
done