


## Build container

docker build --pull --rm -t ${ACR_NAME}.azurecr.io/nodedep-loadtest:${NODEDEP_LOADTEST_TAG} .
docker push ${ACR_NAME}.azurecr.io/nodedep-loadtest:${NODEDEP_LOADTEST_TAG}


## Launch into ACI

setup environment variables for your continer registry and run ```./launch.sh``


* NODEDEP_LOADTEST_TAG=
* DEPLOY_RG=
* ACR_RG=
* ACR_NAME=


## Open

http://nodedep-loadtest.westeurope.azurecontainer.io:8089/


