
echo "getting acr creds"
ACR_PASSWD=$(az acr credential show --name ${ACR_NAME} --resource-group ${ACR_RG} --query passwords[0].value --output tsv)

echo "Launching master"
sed -e "s|_NODEDEP_LOADTEST_TAG_|${NODEDEP_LOADTEST_TAG}|g" -e "s|_ACR_PASSWD_|${ACR_PASSWD}|g" -e "s|_ACR_NAME_|${ACR_NAME}|g" ./nodedep-loadtest-aci-master.yml >./m1.yml
az container create --resource-group $DEPLOY_RG  --registry-login-server ${ACR_NAME}.azurecr.io --registry-password $ACR_PASSWD  --registry-username $ACR_NAME -f ./m1.yml
rm ./m1.yml


for i in "01" "02" "03" "04"; do 
    echo "Launching worker $i"
    sed -e "s|_NN_|${i}|g" ./nodedep-loadtest-aci-worker.yml -e "s|_NODEDEP_LOADTEST_TAG_|${NODEDEP_LOADTEST_TAG}|g" -e "s|_ACR_PASSWD_|${ACR_PASSWD}|g" -e "s|_ACR_NAME_|${ACR_NAME}|g" >./w${i}.yml
    az container create --resource-group $DEPLOY_RG -f ./w${i}.yml
    rm ./w${i}.yml
done



