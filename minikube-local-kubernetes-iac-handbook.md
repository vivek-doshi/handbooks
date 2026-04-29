# Minikube: Local Kubernetes and IaC Handbook

Audience: Beginner-to-intermediate developers and DevOps engineers who want to validate Kubernetes and Infrastructure as Code workflows locally before deploying to cloud platforms.

Why this handbook exists: Running fast local feedback loops with Minikube prevents expensive trial-and-error in cloud environments. You can debug manifests, Terraform, networking, and container image behavior on your laptop first, then promote proven code to EKS, AKS, or GKE.

---

## Module 1: The Local Kubernetes Paradigm

### 1.1 What is Minikube?
Minikube is a lightweight local Kubernetes implementation. It creates a virtual machine or container on your machine, then boots a Kubernetes cluster inside it. Most commonly, that local cluster is a single-node cluster.

In plain terms:
- Your laptop becomes a Kubernetes lab.
- You get real Kubernetes APIs (`kubectl`, Deployments, Services, Ingress, etc.).
- You can test production-like behavior without paying for cloud resources.

### 1.2 Why use Minikube?
Compared with managed cloud clusters (EKS, AKS, GKE):

- Zero infrastructure cost while learning and iterating.
- Offline development capability once dependencies are installed.
- Rapid prototyping: start, test, destroy, repeat.
- Fast failure feedback: no waiting on cloud provisioning.
- Safer experimentation: break things locally before touching production.

Cloud clusters are still mandatory for final validation, but Minikube dramatically reduces noisy, expensive early-stage mistakes.

### 1.3 Minikube vs alternatives

| Tool | Core model | Strengths | Trade-offs | Why Minikube is often preferred |
|---|---|---|---|---|
| Minikube | Single-node Kubernetes in VM/container | Rich addon ecosystem, easy lifecycle commands, good local parity | Slightly heavier than pure container-based options | Addons like `metrics-server` and `ingress` make it ideal for practical app testing |
| Docker Desktop Kubernetes | Kubernetes embedded in Docker Desktop | Very easy on Windows/macOS for Docker users | Less explicit control and fewer built-in addon workflows | Good for quick starts, but Minikube is more flexible for DevOps experiments |
| Kind (Kubernetes in Docker) | Kubernetes nodes as Docker containers | Great for CI pipelines and multi-node local topologies | Fewer turnkey addons, more manual setup for some features | Kind is great for CI; Minikube is often easier for daily local DevEx |

---

## Module 2: Getting Started and Core Lifecycle

### 2.1 Installation and drivers
Minikube requires a driver. A driver is how Minikube runs its Kubernetes node locally.

Common driver choices:
- Docker (modern standard for most developers)
- Hyper-V (Windows)
- VirtualBox
- KVM2 (Linux)

Docker driver is generally the simplest and most portable today.

### 2.2 Install Minikube and kubectl

```bash
# Verify Docker first
docker --version

# Windows (Chocolatey)
choco install minikube kubernetes-cli -y

# macOS (Homebrew)
brew install minikube kubectl

# Linux (example binary install)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# kubectl (Linux quick install)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl

# Confirm tools
minikube version
kubectl version --client
```

### 2.3 Daily commands (core lifecycle)

| Goal | Command |
|---|---|
| Start cluster with resources | `minikube start --driver=docker --memory=4096 --cpus=2` |
| Stop cluster | `minikube stop` |
| Pause cluster | `minikube pause` |
| Unpause cluster | `minikube unpause` |
| Delete cluster | `minikube delete` |
| Check status | `minikube status` |
| Open dashboard | `minikube dashboard` |
| Check node list | `kubectl get nodes -o wide` |

### 2.4 Addons
Addons are packaged Kubernetes components that Minikube can enable quickly.

Important ones for realistic testing:
- `metrics-server`: required for resource metrics and Horizontal Pod Autoscaler testing.
- `ingress`: NGINX ingress controller for host/path routing scenarios.

Commands:

```bash
# List addons and their state
minikube addons list

# Enable common addons
minikube addons enable metrics-server
minikube addons enable ingress

# Verify
kubectl get pods -n kube-system
kubectl get deployment metrics-server -n kube-system
kubectl get pods -n ingress-nginx
```

---

## Module 3: Networking and Exposing Services Locally

### 3.1 The localhost problem
When you create a Kubernetes Service of type `LoadBalancer` in cloud environments, a cloud controller provisions an external load balancer and assigns an external IP.

On Minikube, there is no cloud load balancer provider by default, so `EXTERNAL-IP` stays `Pending`.

```bash
kubectl get svc
```

You will often see:
- `TYPE: LoadBalancer`
- `EXTERNAL-IP: <pending>`

### 3.2 Minikube tunnel
`minikube tunnel` simulates cloud load balancer behavior locally and assigns reachable external IPs.

```bash
# Run in a dedicated terminal (may require admin privileges)
minikube tunnel

# In another terminal, confirm external IP allocation
kubectl get svc
```

### 3.3 NodePort quick access
For local testing, NodePort is often simplest.

```bash
# Create or apply service first
kubectl apply -f service-nodeport.yaml

# Open service URL in browser directly
minikube service my-app-service

# Print URL only
minikube service my-app-service --url
```

Example NodePort service file:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
  namespace: dev
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080
```

---

## Module 4: Infrastructure as Code (Minikube plus Terraform)

### 4.1 The IaC bridge
Minikube lets you test Terraform Kubernetes resources locally. This is powerful because:
- You validate provider auth and state behavior.
- You verify manifests generated by Terraform.
- You catch misconfigurations before changing cloud clusters.

You are not provisioning AWS or Azure resources here. You are proving Kubernetes IaC logic in a safe local target.

### 4.2 Complete Terraform provider configuration (`main.tf`)

```hcl
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30"
    }
  }
}

variable "kube_context" {
  description = "Kubeconfig context to target"
  type        = string
  default     = "minikube"
}

provider "kubernetes" {
  config_path    = pathexpand("~/.kube/config")
  config_context = var.kube_context
}

resource "kubernetes_namespace" "dev" {
  metadata {
    name = "dev"
    labels = {
      environment = "local"
      managed_by  = "terraform"
    }
  }
}

resource "kubernetes_deployment" "nginx" {
  metadata {
    name      = "nginx"
    namespace = kubernetes_namespace.dev.metadata[0].name
    labels = {
      app = "nginx"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "nginx"
      }
    }

    template {
      metadata {
        labels = {
          app = "nginx"
        }
      }

      spec {
        container {
          name  = "nginx"
          image = "nginx:1.27"

          port {
            container_port = 80
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "300m"
              memory = "256Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "nginx" {
  metadata {
    name      = "nginx"
    namespace = kubernetes_namespace.dev.metadata[0].name
  }

  spec {
    selector = {
      app = "nginx"
    }

    port {
      port        = 80
      target_port = 80
      node_port   = 30080
    }

    type = "NodePort"
  }
}
```

### 4.3 Terraform workflow (`init`, `plan`, `apply`)

```bash
# 1) Ensure Minikube cluster is running
minikube start --driver=docker --memory=4096 --cpus=2

# 2) Initialize Terraform
terraform init

# 3) Preview changes
terraform plan -var="kube_context=minikube"

# 4) Apply changes
terraform apply -var="kube_context=minikube" -auto-approve

# 5) Validate resources
kubectl get ns
kubectl get deploy,svc -n dev

# 6) Open deployed service
minikube service nginx -n dev

# 7) Tear down when done
terraform destroy -var="kube_context=minikube" -auto-approve
```

### 4.4 Why this saves time and money
Testing Terraform logic in Minikube means:
- fewer failed cloud applies,
- fewer chargeable cloud test environments,
- faster iteration cycles for teams.

---

## Module 5: Managing Local Docker Images

### 5.1 The registry conundrum
A common surprise: an image built on your host Docker daemon is not always visible to Minikube's runtime. That leads to pod image pull errors when Kubernetes cannot find your image.

### 5.2 Build directly into Minikube image cache
Point your shell to Minikube's internal Docker daemon first, then build.

Linux/macOS:

```bash
eval $(minikube docker-env)
docker build -t my-app:local .
```

PowerShell:

```powershell
minikube -p minikube docker-env --shell powershell | Invoke-Expression
docker build -t my-app:local .
```

Then deploy with a local pull policy:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: dev
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:local
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
```

Apply and test:

```bash
kubectl apply -f deployment.yaml
kubectl get pods -n dev -w
kubectl logs -n dev deploy/my-app
```

### 5.3 End-to-end workflow (code to running pod)
1. Write app code.
2. Build image into Minikube daemon.
3. Apply Kubernetes YAML or Terraform.
4. Expose with NodePort or tunnel.
5. Validate behavior.
6. Fix fast locally.
7. Promote the same manifests and Terraform patterns to cloud.

This is the practical DevEx loop that avoids expensive cloud debugging.

---

## Module 6: Common Pitfalls and Anti-Patterns

### Pitfall 1: Resource starvation
Symptom:
- Heavy charts (Prometheus, databases, service meshes) fail to schedule or crash repeatedly.
- Pods enter `CrashLoopBackOff` or `Pending`.

Cause:
- Default Minikube resources are often too small for realistic workloads.

Fix:

```bash
# Recreate cluster with higher capacity
minikube delete
minikube start --driver=docker --memory=8192 --cpus=4

# Inspect pressure
kubectl top nodes
kubectl top pods -A
kubectl describe pod <pod-name> -n <namespace>
```

Also set explicit resource requests/limits in deployments to improve scheduling predictability.

### Pitfall 2: Hardcoded contexts in Terraform
Anti-pattern:
- Hardcoding `config_context = "minikube"` directly in provider blocks in shared code.

Why this hurts:
- The same Terraform code breaks or is manually edited when moving to AKS/EKS/GKE contexts.
- Manual edits create drift and deployment risk.

Bad pattern:

```hcl
provider "kubernetes" {
  config_path    = pathexpand("~/.kube/config")
  config_context = "minikube"
}
```

Better pattern:

```hcl
variable "kube_context" {
  type    = string
  default = "minikube"
}

provider "kubernetes" {
  config_path    = pathexpand("~/.kube/config")
  config_context = var.kube_context
}
```

Then switch target safely:

```bash
terraform plan -var="kube_context=aks-dev-context"
```

### Pitfall 3: Wrong `imagePullPolicy` for local images
Symptom:
- Pod fails with `ErrImagePull` or `ImagePullBackOff` for `my-app:local`.

Cause:
- `imagePullPolicy: Always` forces pull from remote registry.
- Your image exists only inside Minikube local daemon and is not pushed remotely.

Bad deployment snippet:

```yaml
containers:
  - name: my-app
    image: my-app:local
    imagePullPolicy: Always
```

Correct local deployment snippet:

```yaml
containers:
  - name: my-app
    image: my-app:local
    imagePullPolicy: IfNotPresent
```

Use `Never` only when you are absolutely sure the image already exists on every node and should never be pulled.

Debug commands:

```bash
kubectl describe pod <pod-name> -n dev
kubectl get events -n dev --sort-by=.metadata.creationTimestamp
```

---

## Quick Reference Cheat Sheet

```bash
# Cluster lifecycle
minikube start --driver=docker --memory=4096 --cpus=2
minikube status
minikube pause
minikube unpause
minikube stop
minikube delete

# Addons
minikube addons enable metrics-server
minikube addons enable ingress

# Networking
minikube tunnel
minikube service <service-name> --url

# Terraform
terraform init
terraform plan -var="kube_context=minikube"
terraform apply -var="kube_context=minikube"
terraform destroy -var="kube_context=minikube"

# Local image flow
eval $(minikube docker-env)
docker build -t my-app:local .
kubectl apply -f deployment.yaml
```

---

## Final Takeaway
Minikube is the cheapest place to fail fast and learn deeply. If your Kubernetes manifests, image strategy, and Terraform resources work in Minikube first, your cloud deployments become significantly safer, faster, and less expensive.