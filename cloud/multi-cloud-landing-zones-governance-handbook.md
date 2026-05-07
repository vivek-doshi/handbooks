# Multi-Cloud Landing Zones & Governance Handbook

A structured reference for platform engineers and cloud architects establishing consistent account structures, identity hierarchies, network foundations, security baselines, and governance operating models across AWS, Azure, and GCP.

---

## What Is a Landing Zone

A landing zone is a pre-configured, multi-account (or multi-subscription/project) cloud environment built to enforce security, identity, network, and compliance baselines before any application workload lands. It is infrastructure-as-policy: the goal is to make the right thing the easy thing.

Landing zones are not one-time deployments. They are living platform foundations that evolve with your organization's posture and compliance requirements.

**Core outcomes a landing zone must deliver:**
- Account isolation between workloads and environments
- Consistent identity and least-privilege access controls
- Network segmentation with controlled egress and ingress
- Enforced security guardrails (preventative and detective)
- Audit trails and observability from day one
- Self-service onboarding for teams without bypassing controls

---

## Account / Subscription / Project Structure

Organize cloud accounts into an organizational hierarchy that reflects risk, compliance, and team boundaries rather than feature boundaries.

### Recommended OU / Management Group Structure

```
Root Organization
├── Security (audit, log archive, SIEM forwarding)
├── Infrastructure (shared services, networking hub, DNS)
├── Sandbox  (unconstrained exploration, auto-expire)
└── Workloads
    ├── Dev    (relaxed guardrails, limited quotas)
    ├── Staging (production-like guardrails, no internet egress)
    └── Production (strictest guardrails, all logging mandatory)
```

**Rules:**
- One account/subscription per environment per workload boundary
- Security and log archive accounts must be owned by the platform team, never delegated
- Sandbox accounts must have hard billing caps and auto-expiry policies
- Never mix production and non-production workloads in the same account

---

## Identity & Access Hierarchy

### Principles

- Centralize IdP (identity provider); never create cloud-local users for humans
- Use short-lived credentials; avoid long-lived access keys entirely
- Apply least privilege at every layer: org, account, resource, and action
- Separate duty between platform team (account management) and application teams (workload IAM)

### Role Structure

| Layer | Who Uses It | Lifetime |
|---|---|---|
| Break-glass / emergency admin | Security team only | Session (< 1 hour), audited |
| Platform admin | Cloud platform team | Federated session (8 h max) |
| Workload admin | Application team lead | Federated session (8 h max) |
| Developer read-only | All engineers | Federated session (4 h max) |
| CI/CD service identity | Pipelines | OIDC short-lived token, no key |
| Workload runtime identity | Application processes | Instance profile / managed identity / WIF |

### Identity Federation Requirements

- All human access via SSO (SAML 2.0 or OIDC federation)
- CI/CD pipelines must use OIDC workload identity federation — no static secrets in vault
- MFA required for all human console access without exception
- Service accounts must not be assigned to humans

---

## Network Foundations

### Hub-and-Spoke Topology

```
Internet ──► WAF / DDoS ──► Ingress Hub (Firewall, NLB)
                               │
          ┌────────────────────┼────────────────────┐
          │                   │                    │
     Dev Spoke           Staging Spoke        Prod Spoke
  (10.1.0.0/16)        (10.2.0.0/16)       (10.3.0.0/16)
          │                   │                    │
      App Subnets         App Subnets          App Subnets
      Data Subnets        Data Subnets         Data Subnets
```

**Rules:**
- Hub VPC/VNet owns shared services: DNS resolvers, NAT gateways, firewall appliances, VPN/ExpressRoute/Direct Connect
- Spoke VPCs/VNets never peer directly with each other — all cross-spoke traffic flows through hub
- Private subnets must have no default route to internet; egress via hub NAT only
- Data subnets must have no NAT route; data layer communicates only within the spoke
- All subnets must have flow logs enabled at creation

### Egress Control Standards

| Traffic Type | Requirement |
|---|---|
| Internet egress | Proxied via centralized firewall with domain allowlist |
| Inter-spoke | Transits hub; firewall rule required for each allowed path |
| Cloud-to-on-premises | Site-to-site VPN or dedicated circuit; no public internet path |
| Service endpoints | Use private endpoints / VPC endpoints for cloud PaaS services |
| Inbound / ingress | WAF required for HTTP(S); allowlisted ports only |

### IP Addressing Standards

- Allocate non-overlapping RFC 1918 ranges per environment at landing zone creation
- Reserve a /16 per environment tier to allow future spoke growth without re-addressing
- Maintain a central IPAM record (AWS VPC IPAM, Azure IPAM, or a shared spreadsheet at minimum)
- Never reuse CIDR ranges that were previously routed to on-premises

---

## Security Baselines

Security baselines are guardrails the landing zone enforces on every account automatically. Distinguish between preventative (block non-compliant action) and detective (alert on non-compliant state).

### Preventative Guardrails

| Control | AWS | Azure | GCP |
|---|---|---|---|
| Deny public S3 / storage bucket | SCP | Azure Policy Deny | Org Policy Constraint |
| Require encryption at rest | SCP | Azure Policy | Org Policy |
| Deny root / global admin account API calls | SCP | Conditional Access | Org Policy |
| Restrict allowed regions | SCP | Azure Policy (allowed locations) | Org Policy |
| Deny IAM key creation for humans | SCP | Conditional Access | Org Policy |

### Detective Guardrails

| Control | AWS | Azure | GCP |
|---|---|---|---|
| Config drift monitoring | AWS Config | Azure Policy / Defender | Security Command Center |
| Unused credentials alert | IAM Access Analyzer | Entra ID reports | IAM Recommender |
| Publicly accessible resource alert | Security Hub | Defender for Cloud | Security Command Center |
| Root login alert | CloudTrail + EventBridge | Entra audit logs | Cloud Audit Logs |
| Unencrypted storage alert | AWS Config Rule | Azure Policy | SCC Finding |

### Mandatory Logging

All accounts must ship the following to the centralized log archive account from day one:

- Cloud provider audit/management plane events (CloudTrail, Activity Log, Cloud Audit Logs)
- VPC/VNet flow logs
- DNS query logs
- Authentication events (login, role assumption, privilege escalation)
- Config change events

Retention minimum: 1 year hot, 7 years cold.

---

## DNS & Connectivity Standards

### DNS Architecture

- Deploy private hosted zones per VPC/VNet; resolve internal services by name, not IP
- Central DNS resolvers in hub VPC/VNet handle cross-spoke and on-premises resolution
- No split-horizon public DNS for internal services — internal names must not resolve externally
- DNS over HTTPS not permitted for workloads (must resolve via controlled resolver)

### Private Endpoint / VPC Endpoint Policy

- All PaaS services (object storage, databases, queues, key management) must be accessed via private endpoints
- Disable public endpoint access on PaaS after private endpoint is confirmed healthy
- Private endpoint DNS entries must be registered in the central private hosted zone automatically

---

## Cloud-Native Landing Zone Tooling

### AWS: AWS Control Tower

- Provides pre-built OU structure, guardrails (SCPs + Config rules), and Account Factory
- Extend with Account Factory for Terraform (AFT) for IaC-managed account vending
- Add AWS Security Hub aggregator in the security account for cross-account findings
- Enroll all new accounts via Control Tower Account Factory — never create accounts manually

### Azure: Azure Landing Zones (ALZ)

- Microsoft-provided Bicep / Terraform reference architecture at `Azure/ALZ-Bicep`
- Management group hierarchy: Root → Platform → Landing Zones → Sandbox
- Built-in policy initiatives enforce logging, defender, encryption, and region restrictions
- Deploy via Azure DevOps / GitHub Actions pipeline with Bicep or Terraform modules

### GCP: GCP Landing Zone / Fabric

- Google Cloud Foundation Fabric (`GoogleCloudPlatform/cloud-foundation-fabric`) is the reference
- Resource hierarchy: Organization → Folders (per environment) → Projects
- Enforced via Org Policy Constraints applied at folder level
- Use GCP Project Factory (Terraform) for self-service project vending with policy inheritance

### Common Patterns Regardless of Provider

| Concern | Pattern |
|---|---|
| New account / project creation | Vending machine pipeline; never manual console |
| Guardrail deployment | Apply at org / management group / folder root, not per account |
| Logging destination | Dedicated audit account / project; app teams have read-only access |
| Break-glass access | Stored in secrets manager; alert on every use; time-limited |
| Drift detection | Continuous compliance scan; alert on P1 deviations within 15 minutes |

---

## Governance Operating Model

A landing zone without a governance loop decays. Establish clear ownership and review cadence.

### Roles

| Role | Responsibility |
|---|---|
| Cloud Platform Team | Owns landing zone definition, vending pipeline, hub network, shared services |
| Security Team | Owns detective guardrails, SIEM integration, access review cadence |
| FinOps / Cost Team | Owns tagging policy, budget alerts, rightsizing recommendations |
| Application Team | Consumes accounts via vending machine; owns workload IAM and workload network rules |
| Compliance / Risk | Reviews control exceptions; signs off on guardrail relaxation requests |

### Review Cadence

| Review | Frequency | Owner |
|---|---|---|
| Guardrail compliance dashboard | Continuous (automated) | Platform + Security |
| Access review (all privileged roles) | Quarterly | Security |
| OU / account structure review | Semi-annual | Platform |
| Cost and quota review | Monthly | FinOps |
| DR drill for platform accounts | Annual | Platform + Security |
| Landing zone version upgrade | Per provider major release | Platform |

### Exception Process

1. Application team submits exception request with business justification and compensating controls
2. Security team reviews; classifies as accepted risk or rejected within 5 business days
3. Accepted exceptions are time-boxed (max 90 days) and tracked in a risk register
4. Exceptions automatically expire; team must re-justify to extend

---

## Cloud Mappings

| Concept | AWS | Azure | GCP |
|---|---|---|---|
| Root grouping | Organization | Tenant / Root Management Group | Organization |
| Account grouping | Organizational Unit (OU) | Management Group | Folder |
| Isolation unit | Account | Subscription | Project |
| Guardrails (preventative) | Service Control Policy (SCP) | Azure Policy (Deny effect) | Org Policy Constraint |
| Guardrails (detective) | AWS Config Rules + Security Hub | Azure Policy / Defender for Cloud | Security Command Center |
| Landing zone tooling | AWS Control Tower + AFT | Azure Landing Zones (Bicep/TF) | Cloud Foundation Fabric |
| Identity federation | AWS IAM Identity Center (SSO) | Microsoft Entra ID | Cloud Identity / Workspace |
| Workload identity | IAM Role for EC2/Lambda (Instance Profile) | Managed Identity | Workload Identity Federation |
| CI/CD identity | OIDC via IAM Role | OIDC via Workload Identity | OIDC via WIF + Service Account |
| Centralized logging | CloudTrail + S3 (audit account) | Diagnostic Settings → Log Analytics | Cloud Audit Logs → GCS Sink |
| Hub networking | Transit Gateway + Firewall | Virtual WAN + Azure Firewall | Network Connectivity Center + Cloud Firewall |
| Private connectivity | VPC Endpoint (Interface / Gateway) | Private Endpoint | Private Service Connect |
| DNS (private) | Route 53 Private Hosted Zone | Azure Private DNS Zone | Cloud DNS Private Zone |
| IP address management | VPC IPAM | Azure VNet Manager | Custom IPAM (no native equivalent) |
| Secrets | AWS Secrets Manager | Azure Key Vault | Secret Manager |

---

## Implementation Checklist

Use this checklist when establishing or auditing a landing zone.

**Organization & Structure**
- [ ] Root organization / tenant created and documented
- [ ] OU / management group hierarchy matches security domains (Security, Infrastructure, Workloads, Sandbox)
- [ ] Account vending machine pipeline operational (no manual account creation)
- [ ] Break-glass account exists, is stored in secrets manager, and alerts on every use
- [ ] Sandbox accounts have billing caps and auto-expiry

**Identity & Access**
- [ ] All human access via federated SSO — no cloud-local users for humans
- [ ] MFA enforced for all human access
- [ ] No long-lived access keys for humans or CI/CD pipelines
- [ ] CI/CD pipelines use OIDC workload identity federation
- [ ] Workload runtime uses instance profile / managed identity / WIF
- [ ] Access reviews scheduled quarterly

**Network**
- [ ] Hub VPC/VNet deployed in dedicated infrastructure account
- [ ] Non-overlapping CIDR ranges allocated and recorded in IPAM
- [ ] Flow logs enabled on all VPCs/VNets at creation
- [ ] All internet egress proxied through centralized firewall
- [ ] Spokes do not peer directly with each other
- [ ] Private endpoints deployed for all PaaS services in production
- [ ] Private DNS zones registered and resolvable from all spokes

**Security Baselines**
- [ ] SCP / Azure Policy / Org Policy applied at root preventing public storage
- [ ] Encryption at rest required by policy for all new storage resources
- [ ] Allowed regions restricted by policy
- [ ] All accounts enrolled in Security Hub / Defender for Cloud / Security Command Center
- [ ] Centralized log archive account operational; retention policy enforced
- [ ] Alert on root / global admin login activity

**Governance**
- [ ] Platform, Security, FinOps roles and ownership documented
- [ ] Compliance dashboard visible to platform and security teams
- [ ] Exception process documented and accessible to application teams
- [ ] Review cadence scheduled in team calendar
