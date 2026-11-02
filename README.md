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
Learning path (beginner → advanced; follow the numbered sequence in `architecture/`):
1. Beginner — architecture-01-dsa-foundations.html: complexity, memory, data structures, and problem-solving.
2. Beginner — architecture-02-enterprise-foundations.html: enterprise domains, technology choices, reviews, and documentation.
3. Beginner — architecture-03-software-architecture.html: quality attributes, styles, tradeoffs, anti-patterns, and design process.
4. Beginner — architecture-04-pattern-decisions.html: compare monoliths, microservices, event-driven, serverless, and related patterns.
5. Intermediate — architecture-05-high-level-design.html: system-level requirements, diagrams, capacity, reliability, and migration.
6. Intermediate — architecture-06-low-level-design.html: interfaces, data models, SOLID, UML, and implementation patterns.
7. Intermediate — architecture-07-modular-monolith.html: domain modules, boundary enforcement, scaling, and extraction.
8. Intermediate — architecture-08-event-driven-systems.html: broker patterns, event contracts, delivery, sagas, and observability.
9. Advanced — architecture-09-grpc-protobuf.html: RPC, HTTP/2, Protocol Buffers, schema evolution, and operations.
10. Advanced — architecture-10-graphql.html: schema design, federation, authorization, security, and performance.
11. Advanced — architecture-11-api-gateway.html: edge security, traffic policy, resilience, and AI gateway patterns.
12. Advanced — architecture-12-togaf.html: TOGAF Standard 10th Edition, ADM, artifacts, and enterprise governance.
13. Advanced — architecture-13-case-studies.html: two worked use cases showing requirements, architecture flows, design rationale, tradeoffs, and failure handling.

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
Learning path (beginner to intermediate; follow the numbered sequence in `machine-learning/`): foundations, math, data, the classic algorithms (regression, Bayes, k-nearest neighbours, SVM, trees, ensembles, clustering), evaluation, then neural networks, PyTorch, CNNs, sequence models, and transformers.
1. Beginner - ml-01-foundations-handbook.html: Beginner: what machine learning is, when to use it, types of learning, core terminology, the end-to-end workflow, and your first working model.
2. Beginner - ml-02-math-stats-handbook.html: Beginner: the practical math behind ML, including vectors and matrices, gradients, probability, Bayes theorem, distributions, statistics, and entropy.
3. Beginner - ml-03-data-features-handbook.html: Beginner: explore and clean data, handle missing values and outliers, encode and scale features, engineer new ones, split correctly, and avoid data leakage.
4. Beginner - ml-04-linear-models-handbook.html: Beginner: linear regression, polynomial features, ridge, lasso and elastic net, gradient descent, logistic regression, loss functions, and when to use each.
5. Beginner - ml-05-bayes-knn-svm-handbook.html: Beginner: Naive Bayes, Bayesian thinking, k-nearest neighbours and support vector machines, with how each works, when to use it, and how to tune it.
6. Intermediate - ml-06-trees-ensembles-handbook.html: Intermediate: decision trees, bagging, random forests, gradient boosting with XGBoost, LightGBM and CatBoost, voting and stacking, with tuning guidance and a chooser table.
7. Intermediate - ml-07-unsupervised-handbook.html: Intermediate: k-means, hierarchical clustering, DBSCAN and HDBSCAN, Gaussian mixtures, PCA, t-SNE and UMAP, anomaly detection, and how to evaluate results without labels.
8. Intermediate - ml-08-evaluation-handbook.html: Intermediate: regression and classification metrics, validation strategies, bias-variance, hyperparameter tuning, imbalanced data, calibration, and model interpretation.
9. Intermediate - ml-09-sklearn-workflow-handbook.html: Intermediate: the scikit-learn estimator API and pipelines, a complete algorithm decision guide for when to use which model, a cheat sheet, and four end-to-end use cases.
10. Intermediate - ml-10-neural-networks-handbook.html: Intermediate: how neural networks work, with perceptrons, activation functions, forward and backward propagation, loss functions, optimisers, regularisation, and a from-scratch NumPy example.
11. Intermediate - ml-11-pytorch-handbook.html: Intermediate: PyTorch tensors and autograd, nn.Module, Dataset and DataLoader, the standard training loop, GPU and mixed precision, torch.compile, saving models, and higher-level tools.
12. Intermediate - ml-12-cnn-sequence-transfer-handbook.html: Intermediate: convolutional neural networks, data augmentation, RNNs, LSTMs and GRUs, time series, embeddings, autoencoders, and transfer learning and fine-tuning with pretrained models.
13. Intermediate - ml-13-attention-transformers-handbook.html: Intermediate: attention and self-attention, the transformer architecture, BERT-style encoders, GPT-style decoders, tokenisation, embeddings, dense versus mixture-of-experts models, and using pretrained models.

### MLOps
Learning path (beginner to advanced; follow the numbered sequence in `mlops/`): fundamentals, data versioning with DVC, experiment tracking and registry (MLflow, W&B), pipelines and orchestration (Kubeflow), DevOps for ML, feature stores and data quality, serving, monitoring and drift, LLMOps, platform components and standards, end-to-end architecture, and five large-scale use cases including SLM fine-tuning.
1. Beginner - mlops-01-fundamentals-handbook.html: Beginner: what MLOps is, why ML systems fail in production, how it differs from DevOps, the ML lifecycle, roles, and maturity levels.
2. Beginner - mlops-02-data-versioning-dvc-handbook.html: Beginner: why data needs versioning, Git plus DVC, remotes, pipelines with dvc.yaml, experiments, and alternatives such as lakeFS, Delta and Iceberg time travel.
3. Beginner - mlops-03-experiment-tracking-registry-handbook.html: Beginner to intermediate: MLflow tracking and registry, Weights and Biases, model signatures, aliases, metadata, and a promotion workflow.
4. Intermediate - mlops-04-pipelines-orchestration-handbook.html: Intermediate: continuous training, pipeline design, orchestrators (Airflow, Kubeflow Pipelines, Argo, Dagster, Prefect, cloud services), caching, distributed training and hyperparameter search.
5. Intermediate - mlops-05-devops-for-ml-handbook.html: Intermediate: how DevOps practices map to ML: repository layout, testing pyramid for ML, CI, CD, GitOps, containers, infrastructure as code, supply chain security and environments.
6. Intermediate - mlops-06-features-data-quality-handbook.html: Intermediate: feature stores, point-in-time correctness, training-serving skew, streaming features, data contracts, validation and lineage.
7. Intermediate - mlops-07-serving-deployment-handbook.html: Intermediate: batch, online, streaming and edge serving, packaging, KServe and other servers, release strategies (shadow, canary, A/B, bandits), autoscaling and optimisation.
8. Intermediate - mlops-08-monitoring-drift-handbook.html: Intermediate: the four layers of ML monitoring, data drift, concept drift, delayed labels, drift metrics, alerting, and closing the loop with retraining.
9. Intermediate - mlops-09-llmops-genai-ops-handbook.html: Intermediate: how MLOps changes for LLM applications and small language models: prompt and model versioning, evaluation datasets, tracing with LangSmith and others, fine-tuning pipelines, GPU serving and cost.
10. Advanced - mlops-10-platform-standards-handbook.html: Advanced: the component map of an MLOps platform, build versus buy, reference stacks by size, current industry standards, governance and regulation, and cost and security practice.
11. Advanced - mlops-11-end-to-end-pipeline-handbook.html: Advanced: a complete reference architecture with environments, data and model flow, CI/CD/CT, governance, a worked example with code and config, and a method for architecting any ML system.
12. Advanced - mlops-12-usecases-tabular-scale-handbook.html: Advanced: real-time fraud detection, a recommender system for hundreds of millions of users, and demand forecasting for hundreds of millions of series, each with scale, architecture, MLOps design and risks.
13. Advanced - mlops-13-usecases-llm-vision-handbook.html: Advanced: an end-to-end MLOps pipeline for fine-tuning a small language model, and a computer vision platform with edge deployment, each at large data scale.

### DevOps
Learning path (beginner → architect; follow the numbered sequence in `devops/`). Beginner steps are quick refreshers; later steps are detailed. For complete working snippets (Dockerfiles, pipelines, Terraform, manifests) use the [DevOps Playbook](https://vivek-doshi.github.io/devops-playbook).
1. Beginner — devops-01-foundations-handbook.html: culture, delivery loop, DORA metrics, and path map.
2. Beginner — devops-02-git-collaboration-handbook.html: branching, pull requests, protected main, and safe undo.
3. Beginner — devops-03-docker-containers-handbook.html: images, Dockerfile principles, Compose, and Podman.
4. Beginner — devops-04-dev-containers-handbook.html: reproducible developer environments and Codespaces.
5. Intermediate — devops-05-kubernetes-handbook.html: workloads, config, probes, autoscaling, RBAC, and debugging.
6. Intermediate — devops-06-networking-handbook.html: CNI, Services, DNS, Gateway API, NetworkPolicy, and mesh.
7. Intermediate — devops-07-local-kubernetes-cli-handbook.html: local clusters and the Docker and kubectl routine.
8. Intermediate — devops-08-github-actions-cicd-handbook.html: pipelines, reuse, OIDC, and hardening.
9. Advanced — devops-09-terraform-iac-handbook.html: state, modules, testing, policy, and drift.
10. Advanced — devops-10-gitops-supply-chain-handbook.html: GitOps, progressive delivery, SLSA, Sigstore, and policy as code.
11. Advanced — devops-11-platform-sre-finops-handbook.html: platforms, OpenTelemetry, SLOs, incidents, and FinOps.
12. Architect — devops-12-devops-modular-monolith-handbook.html: lean delivery architecture for a modular monolith.
13. Architect — devops-13-devops-microservices-handbook.html: opinionated reference architecture for 20 microservices.
14. Architect — devops-14-pipeline-case-studies-handbook.html: enterprise paved-road and standards-informed regulated pipeline case studies, with diagrams and design rationale.

### Cloud
Learning path (beginner → architect; follow the numbered sequence in `cloud/`): cloud basics, AWS/Azure/GCP core and AI tracks, then governance, FinOps, resilience, and worked reference architectures.
1. Beginner — cloud-01-fundamentals-handbook.html: Beginner: cloud service models, shared responsibility, regions and zones, identity, networking, storage, cost basics, and where AI fits.
2. Beginner — cloud-02-aws-core-handbook.html: Beginner to intermediate: the major AWS services for compute, containers, storage, databases, networking, IAM, messaging, observability, and cost.
3. Intermediate — cloud-03-aws-ai-handbook.html: Intermediate: building generative AI and ML on AWS with Amazon Bedrock, Knowledge Bases, Guardrails, agents, SageMaker, Trainium and Inferentia, plus security and cost.
4. Beginner — cloud-04-azure-core-handbook.html: Beginner to intermediate: the major Azure services for compute, containers, storage, databases, networking, Microsoft Entra ID, messaging, monitoring, and cost.
5. Intermediate — cloud-05-azure-ai-handbook.html: Intermediate: building generative AI and ML on Azure with Microsoft Foundry, Azure OpenAI models, Azure AI Search, agents, Azure Machine Learning, content safety, and governance.
6. Beginner — cloud-06-gcp-core-handbook.html: Beginner to intermediate: the major Google Cloud services for compute, Cloud Run, GKE, storage, BigQuery, databases, VPC, IAM, messaging, observability, and cost.
7. Intermediate — cloud-07-gcp-ai-handbook.html: Intermediate: building generative AI and ML on Google Cloud with Vertex AI, Gemini models, Model Garden, RAG Engine and Vector Search, Agent Builder, TPUs, and security.
8. Intermediate — cloud-08-service-map-handbook.html: Intermediate: map equivalent services across AWS, Azure, and Google Cloud, including AI, with guidance on where equivalents differ.
9. Advanced — cloud-09-landing-zones-handbook.html: Advanced: multi-cloud landing zones, account structure, identity, network foundations, policy as code, security baselines, sovereignty, AI guardrails, and the governance operating model.
10. Advanced — cloud-10-architecture-standards-handbook.html: Advanced: cloud architecture principles and reusable patterns including three-tier, containers, serverless, event-driven, multi-region, and AI workloads, with well-architected pillars and anti-patterns.
11. Advanced — cloud-11-finops-handbook.html: Advanced: the FinOps framework, FOCUS billing data, tagging, commitments, rightsizing, Kubernetes allocation, AI and GPU cost governance, showback, and maturity.
12. Advanced — cloud-12-resilience-dr-handbook.html: Advanced: RTO and RPO, recovery patterns, backups and immutability, data replication, recovery as code, communications, compliance (DORA, NIS2), chaos testing, and AI system recovery.
13. Architect — cloud-13-arch-classic-handbook.html: Architect level: worked cloud architectures for a global e-commerce platform and a multi-tenant SaaS product, with service choices across AWS, Azure, and Google Cloud, plus where AI fits.
14. Architect — cloud-14-arch-data-ai-handbook.html: Architect level: worked cloud architectures for real-time analytics with ML, an AI copilot embedded in a business application, and an agentic workflow platform, across AWS, Azure, and Google Cloud.
15. Architect — cloud-15-arch-pure-ai-handbook.html: Architect level: worked cloud architecture for an enterprise generative AI platform with an LLM gateway, retrieval service, model training and fine-tuning, and scalable inference across AWS, Azure, and Google Cloud.

### AI Frameworks
- autogen-handbook.html — AutoGen Handbook
- langchain-handbook.html — LangChain Handbook
- langgraph-handbook.html — LangGraph Handbook
- smolagents-handbook.html — SmolAgents Handbook

### Generative AI
Learning path (beginner to advanced; follow the numbered sequence in `gen-ai/`): LLM foundations, prompting, embeddings and vector search, RAG and advanced RAG strategies, context engineering, fine-tuning, tools, agents and MCP, evaluation and guardrails, then GenAI architecture: components, fine-tune versus RAG decisions, serving and cost, five large-scale use cases, and architecture case studies with four further complete use-case designs.
1. Beginner - genai-01-llm-foundations-handbook.html: Beginner: what large language models are, tokens and context windows, sampling settings, the model landscape, known limitations, and your first API call.
2. Beginner - genai-02-prompting-handbook.html: Beginner: roles, clear instructions, few-shot examples, reasoning prompts, structured outputs, prompt injection basics, and how to version and test prompts.
3. Beginner - genai-03-embeddings-vector-search-handbook.html: Beginner: embeddings, similarity metrics, approximate nearest neighbour indexes, choosing a vector database, hybrid search, and memory sizing.
4. Beginner - genai-04-rag-basics-handbook.html: Beginner: what retrieval-augmented generation is, the ingest and query pipelines, chunking, a working minimal example, evaluation basics, and when RAG is the wrong tool.
5. Intermediate - genai-05-advanced-rag-handbook.html: Intermediate: how to improve retrieval with hybrid search, reranking, query transformation, contextual chunks, parent-child retrieval, GraphRAG, agentic and multimodal RAG, and how to pick a strategy from the symptom.
6. Intermediate - genai-06-context-engineering-handbook.html: Intermediate: designing what goes into the context window, token budgets, conversation memory, prompt caching, long context versus RAG, and compression.
7. Intermediate - genai-07-fine-tuning-fundamentals-handbook.html: Intermediate: what fine-tuning changes, SFT, LoRA and QLoRA, preference tuning and RL, data formats and quality, key hyperparameters, evaluation and pitfalls.
8. Intermediate - genai-08-fine-tuning-practice-handbook.html: Intermediate: a QLoRA run with Hugging Face TRL and PEFT, Unsloth, DPO and GRPO, GPU memory sizing, multi-GPU options, merging, quantised export, and serving adapters.
9. Intermediate - genai-09-agents-tools-mcp-handbook.html: Intermediate: function calling, workflow versus agent patterns, the agent loop with budgets and verifiers, the Model Context Protocol, multi-agent designs, and failure modes.
10. Intermediate - genai-10-evaluation-guardrails-handbook.html: Intermediate: offline and online evaluation, LLM-as-judge, RAG and agent metrics, guardrail layers, red teaming, tracing, and governance basics.
11. Intermediate - genai-11-architecture-components-handbook.html: Intermediate: the reference architecture of a generative AI system, what each component does, why it exists, when to add it, and the common architecture shapes from a simple assistant to an agent platform.
12. Advanced - genai-12-architecture-decisions-handbook.html: Advanced: a decision framework for prompting versus RAG versus fine-tuning versus agents, RAG strategy selection by data scale and type, model selection and hosting, and cost break-even analysis.
13. Advanced - genai-13-serving-scale-cost-handbook.html: Advanced: inference mechanics, serving engines, GPU capacity sizing, autoscaling, gateways, caching and routing, large-scale ingestion and index operations, and a cost-control playbook.
14. Advanced - genai-14-usecases-knowledge-support-handbook.html: Advanced: architecting an enterprise knowledge assistant over a billion chunks and a customer support platform handling tens of millions of conversations, with data scale, RAG strategy, fine-tuning decisions, capacity and cost.
15. Advanced - genai-15-usecases-documents-code-handbook.html: Advanced: architecting a document extraction pipeline processing tens of millions of documents a month and a code intelligence platform over billions of lines of code.
16. Advanced - genai-16-usecase-analytics-agent-handbook.html: Advanced: architecting a natural-language analytics agent over a multi-petabyte lakehouse, then a cross-case comparison, a production-readiness checklist and where to go next.
17. Advanced - genai-17-architecture-case-studies-handbook.html: Advanced: an enterprise GenAI platform and a standards-aligned assistant for a high-impact process, with flow diagrams, design rationale, tradeoffs and validation.
18. Advanced - genai-18-usecases-field-service-catalog-handbook.html: Advanced: a safety-critical multimodal RAG assistant for field technicians and a high-volume catalog enrichment pipeline on a fine-tuned small model, with decision paths, diagrams, capacity and cost.
19. Advanced - genai-19-usecases-regulatory-incident-handbook.html: Advanced: a temporal and citation-aware RAG assistant for regulatory research and a bounded incident-response agent with human approval, with decision paths, diagrams, capacity and cost.
### Tooling
- claude-code-handbook.html — Claude Code Handbook
- dev-containers-handbook.html — Dev Containers Handbook
- llamacpp_handbook.html — llama.cpp Handbook
- llm-api-standards-tooling-handbook.html — LLM API Standards and Tooling Handbook
- github-copilot-handbook.html — GitHub Copilot Handbook

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

Handbook metadata convention (required for all handbook HTML files):

- Add these non-visible meta tags in the <head> (right after viewport is recommended):
	- <meta name="handbook-version" content="v1">
	- <meta name="last-updated" content="YYYY-MM-DD">
- Add this hidden signature immediately after the opening <body> tag:
	- <div hidden data-handbook-signature="v1|YYYY-MM-DD"></div>
- Keep these values aligned on every handbook update.
- This signature is intentionally not visible in rendered UI and is for maintenance/version tracking.

The shared UI behavior and styling are organized through the shared assets in styles/ and scripts/.

## Handbook Review Tracking

Handbook freshness is tracked with a central registry and an automated weekly audit.

Tracking files:

- handbook-tracking/handbook-registry.csv
- handbook-tracking/handbook-update-log-template.md
- scripts/handbook_review_audit.py
- .github/workflows/handbook-review-check.yml

Run tracking commands from repo root:

1. python scripts/handbook_review_audit.py --sync
2. python scripts/handbook_review_audit.py --audit

Expected workflow:

1. Update handbook content.
2. Update handbook metadata (handbook-version and last-updated).
3. Run sync to refresh registry entries.
4. Add an update-log entry using the template.
5. Run audit and fix any overdue/invalid registry items before merge.

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
- Rewritten as the 12-step beginner-to-advanced learning path documented above.

### AI Governance
- ai-guardrails-handbook.html — AI Guardrails & Safety Handbook
- ai-harner-engineering-handbook.html — AI Harness Engineering Handbook
- llm-evaluation-and-testing-handbook.html — LLM Evaluation and Testing Handbook
