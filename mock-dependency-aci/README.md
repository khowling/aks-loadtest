

## Build mock server container

```
cd mockserver
docker build --pull --rm -t ${ACR_NAME}.azurecr.io/nodedep-dependency:${NODEDEP_DEPENDENCY_TAG} .
docker push ${ACR_NAME}.azurecr.io/nodedep-dependency:${NODEDEP_DEPENDENCY_TAG}
```

## Build nginx config container

TEST
```
curl -k -d '{}' https://nodedep-dependency-01.westeurope.azurecontainer.io
```

