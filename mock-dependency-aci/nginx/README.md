
https://docs.microsoft.com/en-us/azure/container-instances/container-instances-container-group-ssl#create-a-self-signed-certificate


```
openssl req -new -newkey rsa:2048 -nodes -keyout ssl-01.key -out ssl-01.csr
openssl req -new -newkey rsa:2048 -nodes -keyout ssl-02.key -out ssl-02.csr
```

FQDN: nodedep-dependency-01.westeurope.azurecontainer.io
FQDN: nodedep-dependency-02.westeurope.azurecontainer.io

```
openssl x509 -req -days 365 -in ssl-01.csr -signkey ssl-01.key -out ssl-01.crt
openssl x509 -req -days 365 -in ssl-02.csr -signkey ssl-02.key -out ssl-02.crt
```

```
cat nginx.conf | base64 > base64-nginx.conf
cat ssl-01.crt | base64 > base64-ssl-01.crt
cat ssl-01.key | base64 > base64-ssl-01.key
cat ssl-02.crt | base64 > base64-ssl-02.crt
cat ssl-02.key | base64 > base64-ssl-02.key
```