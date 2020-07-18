
echo "getting acr creds"
ACR_PASSWD=$(az acr credential show --name ${ACR_NAME} --resource-group ${ACR_RG} --query passwords[0].value --output tsv)


for i in "01" "02"; do 
    echo "Launching worker $i"
    sed -e "s|_NN_|${i}|g" -e "s|_NODEDEP_DEPENDENCY_TAG_|${NODEDEP_DEPENDENCY_TAG}|g" -e "s|_ACR_PASSWD_|${ACR_PASSWD}|g" -e "s|_ACR_NAME_|${ACR_NAME}|g" ./nodedep-dependency-v3.yml -e "s|ACR_PASSWD|${ACR_PASSWD}|g" >./d${i}.yml
    az container create --resource-group $DEPLOY_RG -f ./d${i}.yml
    rm ./d${i}.yml
done

