# Handbooks Repository

This repository contains a set of quick handbooks and reference documents for engineering, AI, and software development topics.

The goal is not to provide full-length books. Each document is intended to be a fast, practical reference that helps you refresh key concepts, patterns, workflows, and terminology without digging through long-form documentation.

## Live Site

Browse the published handbook collection here:

- https://vivek-doshi.github.io/handbooks/

## Purpose

Use this repo as a lightweight handbook library for:

- quick concept refreshers
- practical reference documents
- topic-specific study guides
- jump-start material for implementation work

Each handbook is designed to be easy to open and scan when you need a concise summary of a subject.

## What This Repository Contains

The repository now includes a central entry page and shared assets in addition to the handbook files.

Main entry point:

- index.html


## Handbook Collection (by Category)

### Databases
- postgresql-beginner-to-intermediate-handbook.html — PostgreSQL Beginner to Intermediate
- postgresql-intermediate-to-advanced-handbook.html — PostgreSQL Intermediate to Advanced
- mssql-beginner-to-intermediate-handbook.html — SQL Server Beginner to Intermediate
- mssql-intermediate-to-advanced-handbook.html — SQL Server Intermediate to Advanced

### Backend
- dotnet-coding-standards.html — .NET Coding Standards
- dotnetcore_handbook.html — .NET Core Handbook

### Architecture
- enterprise-begineers-guide.html — Enterprise Architecture — Beginner's Guide
- software-architecture-patterns-decision-makers-handbook.html — Software Architecture Patterns: Decision Maker's Handbook
- architecture-handbook.html — Architecture Patterns and Antipatterns: Decision Maker

### Frontend
- angular-20-handbook.html — Angular 20 Handbook
- modern-angular-beginner-to-intermediate-handbook.html — Modern Angular Beginner to Intermediate
- react-redux-handbook.html — React Redux Handbook

### Python
- python101_handbook.html — Python 101 Handbook
- python-201-handbook.html — Python 201 Handbook
- python301_handbook.html — Python 301 Handbook
- python-fastapi-handbook.html — Python and FastAPI Handbook

### Data Engineering
- data-engineering-core-concepts-python-handbook.html — Data Engineering Core Concepts
- pandas-handbook.html — Pandas Handbook

### Machine Learning
- ml-fundamentals-handbook.html — ML Fundamentals Handbook
- pytorch-handbook.html — PyTorch Handbook
- sklearn-handbook.html — Scikit-Learn Handbook

### MLOps
- kubeflow_handbook.html — Kubeflow Handbook
- langsmith-handbook.html — LangSmith Handbook
- mlflow-handbook.html — MLflow: Enterprise Lifecycle Handbook
- mlops-handbook.html — MLOps & Model Deployment Handbook
- wandb-enterprise-handbook.html — W&B Enterprise Handbook

### DevOps
- docker-containerization-enterprise-handbook.html — Docker & Containerization Enterprise Handbook
- git-team-collaboration-handbook.html — Git Team Collaboration
- github-actions-handbook.html — GitHub Actions Handbook
- kubernetes_handbook.html — Kubernetes Handbook
- docker-k8s-command-reference-handbook.html — Docker & Kubernetes Command Reference Handbook
- minikube-local-kubernetes-iac-handbook.html — Minikube: Local Kubernetes and IaC Handbook
- terraform-handbook.html — Terraform Handbook

### Cloud
- aws-cloud-engineer-handbook.html — AWS Cloud Engineer Handbook
- multi-cloud-architecture-scaling-standards-handbook.html — Multi-Cloud Architecture & Scaling Standards Handbook
- multi-cloud-cost-governance-standards-handbook.html — Multi-Cloud Cost Governance Standards Handbook
- multi-cloud-disaster-recovery-runbook-handbook.html — Multi-Cloud Disaster Recovery Runbook Handbook
- multi-cloud-landing-zones-governance-handbook.html — Multi-Cloud Landing Zones & Governance Handbook
- azure-cloud-engineer-handbook.html — Azure Cloud Engineer Handbook
- gcp-cloud-engineer-handbook.html — GCP Cloud Engineer Handbook

### AI Frameworks
- autogen-handbook.html — AutoGen Handbook
- context-engineering-advanced-rag-handbook.html — Context Engineering & Advanced RAG Handbook
- langchain-handbook.html — LangChain Handbook
- langgraph-handbook.html — LangGraph Handbook
- smolagents-handbook.html — SmolAgents Handbook
- mcp-agentic-tooling-handbook.html — MCP and Agentic Tooling Handbook

### Prompting
- advanced-prompt-engineering-handbook.html — Advanced Prompt Engineering Handbook
- llm-concepts-handbook.html — LLM Concepts Handbook

### Tooling
- claude-code-handbook.html — Claude Code Handbook
- dev-containers-handbook.html — Dev Containers Handbook
- llamacpp_handbook.html — llama.cpp Handbook
- llm-api-standards-tooling-handbook.html — LLM API Standards and Tooling Handbook
- github-copilot-handbook.html — GitHub Copilot Handbook

### Fine-Tuning
- fine-tuning-handbook.html — Fine-Tuning Handbook
- hugging-face-fine-tuning-llm-handbook.html — Hugging Face Fine-Tuning & LLM Handbook
- unsloth_handbook.html — Unsloth Fine-Tuning Handbook

### Platform
- palantir-foundry-developer-handbook.html — Palantir Foundry Handbook

Shared assets:

- styles/
- scripts/

These files work well as:

- quick reference notes during development
- interview or study revision material
- onboarding summaries for unfamiliar topics

## How To Use

You can use the repository in two ways:

1. Open the published site: https://vivek-doshi.github.io/handbooks/
2. Open index.html locally as the starting page for the handbook collection.

The index page provides a card-based entry point for all handbooks.

Each handbook page includes:

- a direct page layout for quick reading
- light mode and dark mode support
- a floating back button to return to index.html

The shared UI behavior and styling are organized through the shared assets in styles/ and scripts/.

## How To Contribute

Contributions should keep the repo focused on concise, useful handbook-style reference material.

When adding or updating content:

1. Create or update a standalone HTML handbook.
2. Use clear, descriptive kebab-case file names.
3. Keep content concise, practical, and easy to scan.
4. Prefer summaries, examples, patterns, and reference-style explanations over long essays.
5. Keep styling in the appropriate CSS files under styles/ rather than embedding full page CSS in the HTML.
6. If you add a new handbook, add it to index.html so it appears in the main card layout.
7. Verify technical accuracy before submitting changes.
8. Add the new handbook to the list in this README.

Recommended contribution areas:

- new engineering or AI topic handbooks
- corrections to outdated material
- clearer examples and explanations
- improved structure or consistency across documents

## Contribution Standard

A good handbook in this repo should be:

- focused on a single topic or technology area
- short enough to be used as a quick reference
- organized with clear headings and sections
- practical rather than overly theoretical
- readable as a standalone document

## Summary

This repository is a collection of quick handbooks and reference documents that make it easier to revisit important topics quickly. It now includes a central index page, shared styling and UI assets, and a published GitHub Pages site for browsing the collection online.


## Upcoming Handbooks

### Security
- devsecops-handbook.html — Shifting security left (SAST, DAST, SCA in CI/CD). - done
- software-supply-chain-security-handbook.html — SBOMs (Software Bill of Materials), Sigstore, and securing dependencies (crucial in the AI era where we pull unknown packages) - done
- zero-trust-architecture-handbook.html — Beyond VPNs. Identity-based access, micro-segmentation, and Zero Trust network paradigms. - done 
- ai-security-and-adversarial-handbook.html — Prompt injection defense, data leakage prevention in LLMs, and AI red-teaming. - done 

### AI Production & Governance
- llm-evaluation-and-testing-handbook.html — Frameworks like RAGAS, TruLens, DeepEval. How do we mathematically prove our RAG system is getting better? - done 
- ai-guardrails-handbook.html — NeMo Guardrails, Llama Guard. Keeping agents within operational boundaries. - done 
- vector-databases-enterprise-handbook.html — You have Advanced RAG, but we need a dedicated refresher on Pinecone, Milvus, Qdrant, and pgvector internals. Vector DBs are the new Relational DBs. done 

### Observability & Reliability
- opentelemetry-handbook.html — The industry standard for traces, metrics, and logs. If an engineer doesn't know OTel, they can't debug modern systems. - done 
- distributed-tracing-handbook.html — Jaeger, Zipkin. Following a request across 8 microservices and 3 LLM calls.  done
- chaos-engineering-handbook.html — Gremlin, Litmus. How we intentionally break things to prove resilience. - done 

### Architecture
- event-driven-architecture-handbook.html — Kafka, Pulsar, RabbitMQ. Event sourcing vs. Pub/Sub. This is the backbone of modern enterprise scaling. - done
- grpc-and-protocol-buffers-handbook.html — High-performance RPC. Crucial for inter-microservice communication. - done 
- graphql-enterprise-handbook.html — When to use it, when not to use it (a common ARB pushback point). - done 
- api-gateway-patterns-handbook.html — Kong, Apigee. Rate limiting, throttling, and exposing AI tools safely to the outside world. - done
