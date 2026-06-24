# iPaaS Agent Skills Marketplace

This project serves as a marketplace for AI agent skills designed for various enterprise integration platforms (e.g., MuleSoft, Workato, Boomi, etc.).

## Tech Stack
- **Frontend**: Vue.js 3, TypeScript, Vite, Tailwind CSS
- **Backend API**: Python 3.12, FastAPI, Mangum (AWS Lambda Wrapper)
- **Infrastructure**: OpenTofu (IaC)
- **Cloud Infrastructure (AWS)**: 
  - **Routing Layer**: Amazon API Gateway (HTTP API v2)
  - **Compute Layer**: AWS Lambda (Serverless Python execution environment)
  - **Persistence Layer**: Amazon DynamoDB (On-Demand / Zero-Idle Cost table)

---

## Project Directory Layout
```text
ipaas-agent-skills/
├── .github/
│   └── workflows/              # CI/CD pipelines for staging and production releases
├── .venv/                      # Local Python virtual environment for backend tooling
├── backend/                    # Serverless Python Backend API
│   ├── app/                    # Core FastAPI application source
│   │   ├── main.py             # App entry point wrapped with Mangum for AWS Lambda
│   │   └── ...                 # Routers, models, and business logic
│   └── requirements.txt        # Backend dependencies (FastAPI, Mangum, Pydantic, etc.)
├── dist/                       # Production-ready SPA build output (generated via Vite)
├── infra/                      # Infrastructure as Code (IaC) Layer
│   ├── .terraform/             # OpenTofu/Terraform initialized provider binaries
│   ├── files/                  # Local build/staging artifacts for deployment packaging
│   ├── main.tf                 # Main resource configurations (Lambda, API Gateway, DynamoDB)
│   ├── outputs.tf              # Managed cloud resource export hooks (e.g., api_endpoint)
│   ├── providers.tf            # Provider blocks (AWS, Archive) and version constraints
│   ├── terraform.tfstate       # Managed state tracking file for current deployment topology
│   └── variables.tf            # Input declarations for environment staging parameters
├── node_modules/               # Local Node.js dependency tree
├── public/                     # Static un-compiled assets (favicons, manifest metadata)
├── src/                        # Vue.js Frontend Core Source
│   ├── __tests__/              # Unit and integration testing suites
│   ├── assets/                 # Global styling matrices and design system vectors
│   ├── components/             # Atomic Design Pattern Interface Architecture
│   │   ├── atoms/              # Pure, low-level contextless blocks (badges, tags, buttons)
│   │   │   ├── CopyButton.vue
│   │   │   ├── SkillBadge.vue
│   │   │   └── TagPill.vue
│   │   ├── molecules/          # Coupled combinations of atoms (cards, form units)
│   │   │   ├── Footer.vue      # Consolidated footer with dynamic social profile links
│   │   │   └── Header.vue      # Global master layout application header navbar
│   │   └── organisms/          # Complex operational UI blocks driving unique app state
│   │       ├── SearchHeader.vue# Real-time data search interface interceptor
│   │       └── SkillGrid.vue   # Dynamic layout grid wrapper rendering parsed agent skills
│   ├── composables/            # Reusable stateful composition API hooks
│   │   ├── useDebounce.ts      # Input action optimization delay provider
│   │   └── useSkills.ts        # Direct AWS API connection hooks, async fetch, and filter states
│   ├── config/                 # Application configuration profiles
│   │   └── env.ts              # Decoupled environment validation configuration and social variables
│   ├── router/                 # Frontend client-side navigation maps
│   │   └── index.ts            # Vue Router 4 configurations with top-scrolling behavior
│   ├── types/                  # Explicit application type boundaries
│   │   ├── index.ts            # Central exports mapping definitions
│   │   └── skill.ts            # Strictly typed domain interfaces for Agent Skills
│   ├── utils/                  # Standalone application helper utilities
│   │   └── copy.ts             # Direct asynchronous browser clipboard interfacing
│   ├── views/                  # Primary view components matched to routing paths
│   │   ├── HomeView.vue        # Core marketplace overview and search landing dashboard
│   │   └── SkillDetailView.vue # Exhaustive technical data visualization view per agent skill
│   ├── App.vue                 # Orchestrator layout framework root view
│   ├── main.ts                 # Application boostrapper, plugin registers, and icon registrations
│   └── style.css               # Base Tailwind CSS injection styles
├── .gitignore                  # Source-control ignore file rules for OpenTofu and node
├── index.html                  # Core application mounting target template
├── package.json                # Project script workflows and npm dependency definitions
├── tailwind.config.js          # Design system variable configurations and styling overrides
├── tsconfig.json               # Explicit strict-mode TypeScript compiler configuration parameters
└── vite.config.ts              # Core build layer settings and source alias configurations
```

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Python 3.12
- OpenTofu (v1.8+)
- AWS CLI configured with appropriate deployment credentials

### Frontend Setup & Local Development

```bash
# Install dependencies
npm install

# Launch local development server
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test
```

## Deployment Architecture (AWS Serverless)
The application utilizes a zero-idle-cost cloud architecture managed entirely via Infrastructure as Code (IaC) using OpenTofu.

### 1. Prepare Python Backend Dependencies
Because the OpenTofu configuration compiles the serverless deployment bundle locally, all external libraries (fastapi, mangum, etc.) must be vendored directly into the application directory prior to running infrastructure steps.

⚠️ **Important (Cross-Compilation Requirement):** AWS Lambda currently runs on a managed **Python 3.12** architecture. If your local development machine or virtual environment uses a different version (e.g., Python 3.13), a standard `pip install` will bundle binary extension wheels (like `pydantic_core`) that are incompatible with the cloud container, resulting in runtime `ImportModuleError` failures.

To safely vendor the dependencies targeting the correct AWS Lambda execution platform and version, run the following command from the root directory of the project:

```bash
pip install -r backend/requirements.txt \
  --target backend/ \
  --platform manylinux2014_x86_64 \
  --python-version 3.12 \
  --only-binary=:all: \
  --upgrade
```  

### 2. Provision Infrastructure via OpenTofu
Navigate to the infrastructure directory to initialize providers, review the execution model, and deploy the stack live to AWS:
```
# Navigate to the infrastructure folder
cd infra/

# Initialize OpenTofu and pull down required provider binaries (AWS and Archive)
tofu init

# Review changes against live cloud resources
tofu plan

# Deploy the infrastructure stack to AWS
tofu apply
```

### 3. State Management
By default, this project is configured to track infrastructure state using a local state file (terraform.tfstate) for decoupled development. For production environments or collaborative teams, this configuration should be migrated to an S3 backend supported by DynamoDB distributed state locking.

## Connecting Frontend to Live Cloud
Once tofu apply completes successfully, it will output your public execution API endpoint:

```
Outputs:
api_endpoint = "[https://a1b2c3d4e5.execute-api.us-east-1.amazonaws.com](https://a1b2c3d4e5.execute-api.us-east-1.amazonaws.com)"
dynamodb_table_name = "ipaas-agent-skills-dev"
```

Copy the generated api_endpoint string and update your frontend environment variables or API composable module (src/composables/useSkills.ts) to route operational traffic directly away from mocks into your live AWS serverless environment.
