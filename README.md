## AKS load testing project, with mock dependencies

Project consists of 

* ```locust``` A locus.io 4 node loadtest cluster lauched in Azure Container Instance
* ```mock-dependency-aci``` A mock JSON API https dependency in ACI using fast golang simple http server and envoy proxy sidecar
* ```techdemo``` A nodejs express app, the with a route that calls the 2 dependencies with configurable agent and timeout settings instremented with Prometheus metrics endpoint

Each directory has a README.md with build and lauch instructions