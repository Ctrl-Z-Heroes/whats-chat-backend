# AKS Notes

**NOTE** - you may need to run `chmod +x ./create.sh` to make this executable.

## Pre-Requistes

1. Ensure you have a domain ready, if not then you will need to purchase one from a reputable vendor.

2. Update the DNS zone module to use your required domain name.

3. The DNS zone is configured to make a single CNAME record that points at a sample loadbalancer. You can remove this or alter as required.

## Steps

1. Run the `create.sh` to init, apply and set `kubectl` to the new cluster.

```sh
bash create.sh
```

2. After the DNS zone has completed, you will need to add the four generated `namespace` records into your vendors domain portal.

**NOTE** - Leave the TTL at 5 mins whilst configuring so you aren't blocked by caching of unconfigured resources. The DNS may take anywhere between 5 mins and a few hours to propagate.
