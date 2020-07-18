
# Build

## Build container

docker build --pull --rm -t ${ACR_NAME}.azurecr.io/nodedep-loadtest:${NODEDEP_LOADTEST_TAG} .
docker push ${ACR_NAME}.azurecr.io/nodedep-loadtest:${NODEDEP_LOADTEST_TAG}


## Launch

./launch.sh


## Open

http://nodedep-loadtest.westeurope.azurecontainer.io:8089/


