# ticketing

Install docker and make sure run 

```bash
kubectl --version
```

to make sure the  docker is working

run 

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

to istall ingress nginx 
*******
Install all dependencies:

```bash
cd auth && npm install
```

```bash
cd client && npm install
```

```bash
cd expiration && npm install
```

```bash
cd orders && npm install
```

```bash
cd payments && npm install
```

```bash
cd tickets && npm install
```
