https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/listeners/listeners#tcp

Each listener is independently configured with some number filter chains, where an individual chain is selected based on its match criteria

When a new connection is received on a listener, the appropriate filter chain is selected, and the configured connection local filter stack is instantiated and begins processing subsequent events. 

The generic listener architecture is used to perform the vast majority of different proxy tasks that Envoy is used for (e.g., rate limiting, TLS client authentication, HTTP connection management, 

__Downstream__: A downstream host connects to Envoy, sends requests, and receives responses.

__Upstream__: An upstream host receives connections and requests from Envoy and returns responses.

__Listener__: A listener is a named network location (e.g., port, unix domain socket, etc.) that can be connected to by __downstream__ clients. Envoy exposes one or more listeners that downstream hosts connect to. Listeners have __filters__ to ditermine if what cluster will process the request
 - __http_connection_manager__ filter. This filter operates at layer 3/4, so it has access to information from IP and TCP (like the host and port numbers for both ends of the connection), but it also understands the HTTP protocol well enough to have access to the HTTP URL, headers, etc., both for HTTP/1.1 and HTTP/2
    - the __http_connection_manager__ __virtual_hosts__ array defines how exactly the filter will make routing decisions (name, domain, routes)

__Cluster__: A cluster is a group of logically similar __upstream__ hosts that Envoy connects to. Envoy discovers the members of a cluster via service discovery & can do loadbalancing etc.


```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

```
cat envoy-edge-v3.yaml | base64 > envoy-edge-v3.base64
cat cert.pem | base64 > cert.pem.base64
cat key.pem | base64 > key.pem.base64
```


### envoy edge config example

https://github.com/envoyproxy/envoy/blob/22391fb702272ce080b4ad491ccd873f7ab14f1b/configs/google-vrp/envoy-edge.yaml



