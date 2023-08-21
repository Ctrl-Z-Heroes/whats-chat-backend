# Sample Application

This serves as a sample repo to deploy a web application with a load balancer.

You can run `kubectl apply -f .` to deploy all the configuration yamls.

## Load Balancer

The **Load Balancer** is a resource created to give our application an external IP.

We can annoate this resource with a tag, which we can assign to a CNAME record in the DNS Zone so we can access it via our domain.

For example, in our `service.yaml` we have the below:

```sh
service.beta.kubernetes.io/azure-dns-label-name: sample-lb
```

Our infrastructure has been setup for "West Europe" or "westeurope" via Terraform. Thus, our CNAME record will be:

```sh

<LOAD_BALANCER_LABEL>.<REGION>.cloudapp.azure.com

sample-lb.westeurope.cloudapp.azure.com
```

## Check Deployment

After the yamls have been added, we can check the status of the deployment with:

```sh
kubectl get services -w
```

This will watch the service until there is a change. Initially, there will **not** be an external IP. After 2-3 mins we should see one appear.

## Check DNS

On the default TTL of 300s, we may need to wait a few minutes for our domain to update with our new CNAME record. This is why we don't set the TTL for much longer at this stage.

You can check on the status of the CNAME record application by running the below:

```sh
dig <TARGET_DOMAIN_NAME> A
dig sample.kubetown.co.uk A
```

You should get a response similar to this:

```sh
dig sample.kubetown.co.uk

; <<>> DiG 9.10.6 <<>> sample.kubetown.co.uk
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 9163
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4000
;; QUESTION SECTION:
;sample.kubetown.co.uk.         IN      A

;; ANSWER SECTION:
sample.kubetown.co.uk.  300     IN      CNAME   sample-lb.westeurope.cloudapp.az
ure.com.
sample-lb.westeurope.cloudapp.azure.com. 10 IN A 51.105.223.116

```

## Connect to the URL

You can run the below to connect to the url in insecure fashion.

```sh
curl --insecure -v https://sample.kubetown.co.uk
```

The response will look like this if succesful:

```sh
> Host: sample.kubetown.co.uk
> User-Agent: curl/8.1.2
> Accept: */*
>
< HTTP/2 200
< content-type: text/plain; charset=utf-8
< content-length: 70
< date: Mon, 21 Aug 2023 08:51:33 GMT
<
Hello, world!
Protocol: HTTP/2.0!
Hostname: helloweb-5f4b966496-5gcwn
```
