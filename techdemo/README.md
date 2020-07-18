
## Setup Prometheus to monitor  app.

The Prometheus Operator __Does not__ use prometheus.io/scrape annotations for Kubernetes Service Discovery, __ServiceMonitors__ should be used instead. The annotation is very limited by its nature and there's no feasible way to support anything beyond "scrape on" and a single port.

ref https://coreos.com/blog/the-prometheus-operator.html

Two Third Party Resources (TPRs) are defined: __Prometheus__ and __ServiceMonitor__.  The Operator ensures at all times that for each __Prometheus__ resource in the cluster a set of Prometheus servers with the desired configuration are running (inc  data retention time, persistent volume claims, number of replicas).  Each Prometheus instance is paired with a respective configuration that specifies which monitoring targets to scrape for metrics and with which parameters. The user can either manually specify this configuration or let the Operator generate it based on the second __Service Monitor__ TPR.

A Prometheus resource object can dynamically include ServiceMonitor objects by their labels


## Percentiles
https://prometheus.io/docs/practices/histograms/

results in 3 metrics

 *_count - number of obsevations (counter)
 *_sum - sum of total observations
 *_bucket (number of obsevations by le )

 - example: 

 request duration within which you have served 95% of requests (need good granular buckets for this).
 histogram_quantile(0.95, sum(rate(nodedep_http_request_duration_seconds_bucket[2m])) by (le))




## Build


docker build -t ${ACR_NAME}.azurecr.io/nodedep-techdemo:${NODEDEP_TECHDEMO_TAG} .


## deploy
docker push ${ACR_NAME}.azurecr.io/nodedep-techdemo:${NODEDEP_TECHDEMO_TAG}
sed -e "s|_NODEDEP_TECHDEMO_TAG_|${NODEDEP_TECHDEMO_TAG}|g" -e "s|_ACR_NAME_|${ACR_NAME}|g" ./deployment.yml | kubectl apply -f -


## Run local
CONNECTION_AGENT="{ \"keepAlive\" : true, \"maxSockets\" : 256 }" DEPENDENCY_URL_01="https://nodedep-dependency-01.westeurope.azurecontainer.io/" DEPENDENCY_URL_02="https://nodedep-dependency-02.westeurope.azurecontainer.io/" DEPENDENCY_TIMEOUT=7000 NODE_TLS_REJECT_UNAUTHORIZED="0"  node bin/www
