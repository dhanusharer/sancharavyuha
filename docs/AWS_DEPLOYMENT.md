# Sanchara Vyuha — AWS Cloud Integration & Deployment Guide
**Event:** WeMakeDevs × AWS Environmental Hacks 2026  
**Track:** Track 03 — Waste and Energy (Public Transport)  

---

## 1. AWS Architecture Overview

Sanchara Vyuha uses a lean, cost-effective, free-tier eligible AWS architecture designed for real-time sustainability telemetry and immutable audit archival:

```mermaid
flowchart TD
    subgraph Edge & Depot
        BMTC_Sensors["BMTC Telemetry & Demand Signals"] --> Backend["FastAPI Backend (Sanchara Vyuha)"]
        Solver["OR-Tools Dynamic Dispatch Solver"] --> Backend
        Engine["Carbon Accounting Engine"] --> Backend
    end

    subgraph AWS Cloud Services [Region: ap-south-1 (Mumbai)]
        Backend -->|"boto3.client('s3')"| S3["Amazon S3\nsanchara-vyuha-audit-archive-2026\n(Immutable Audit Reports & Decision Logs)"]
        Backend -->|"boto3.client('cloudwatch')"| CW["Amazon CloudWatch\nNamespace: SancharaVyuha/PublicTransport\n(EmissionsAvoidedKg, FuelSavedLiters)"]
    end

    subgraph Resilient Local Adapter (Fallback)
        Backend -.->|"Offline / No Creds"| LocalS3["Local S3 Storage Adapter\n(data/s3_archive/)"]
        Backend -.->|"Offline / No Creds"| LocalCW["Local CloudWatch Telemetry Adapter"]
    end

    subgraph Frontend Dashboard
        Backend <-->|"REST APIs & WebSockets"| ReactApp["React 18 + Vite Dashboard\n(Green Mobility & AWS Hub)"]
    end
```

### Services Used & Roles:
1. **Amazon S3 (`sanchara-vyuha-audit-archive-2026`)**:
   - Stores immutable JSON environmental impact audit packages.
   - Provides ETag verification and cryptographic audit integrity for hackathon judges and municipal stakeholders.
2. **Amazon CloudWatch (`SancharaVyuha/PublicTransport`)**:
   - Ingests real-time custom transit sustainability metrics (`EmissionsAvoidedKg`, `FuelSavedLiters`, `EcoScore`, `EVFleetUtilizationPct`).
   - Enables operational alarms if corridor deadhead emissions exceed threshold values.
3. **AWS SDK for Python (`boto3`)**:
   - Native integration with connection pooling, retries, and automatic credential discovery (IAM role or environment variables).
4. **Resilient Local Mock Adapter**:
   - When AWS credentials are not configured (or `USE_AWS_MOCK=true`), the system seamlessly switches to local adapters without crashing or blocking evaluation.

---

## 2. Least-Privilege IAM Policy

To deploy Sanchara Vyuha with AWS, create an IAM user or IAM role with the following scoped policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SancharaVyuhaS3AuditAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sanchara-vyuha-audit-archive-2026",
        "arn:aws:s3:::sanchara-vyuha-audit-archive-2026/*"
      ]
    },
    {
      "Sid": "SancharaVyuhaCloudWatchMetrics",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "cloudwatch:namespace": "SancharaVyuha/PublicTransport"
        }
      }
    }
  ]
}
```

---

## 3. Step-by-Step AWS Setup & Deployment

### Step 3.1: Create S3 Bucket (AWS CLI)
```bash
aws s3api create-bucket \
  --bucket sanchara-vyuha-audit-archive-2026 \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1
```

Enable server-side encryption:
```bash
aws s3api put-bucket-encryption \
  --bucket sanchara-vyuha-audit-archive-2026 \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]
  }'
```

### Step 3.2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```ini
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=sanchara-vyuha-audit-archive-2026
AWS_CLOUDWATCH_NAMESPACE=SancharaVyuha/PublicTransport
USE_AWS_MOCK=false
```

### Step 3.3: Verify Connection via API
Run:
```bash
curl http://localhost:8000/api/v1/aws/status
```
Expected response:
```json
{
  "status": "operational",
  "provider_mode": "live_aws",
  "region": "ap-south-1",
  "s3": {
    "bucket_name": "sanchara-vyuha-audit-archive-2026",
    "connected": true,
    "is_live": true
  },
  "cloudwatch": {
    "namespace": "SancharaVyuha/PublicTransport",
    "connected": true,
    "is_live": true
  }
}
```

---

## 4. Cost Analysis & Free-Tier Suitability

Sanchara Vyuha was deliberately architected to stay entirely within the **AWS Free Tier**:
- **Amazon S3**:
  - 5 GB Standard Storage (Free Tier).
  - 20,000 GET requests & 2,000 PUT requests / month (Free Tier).
  - Audit packages are ~3 KB JSON files. 100 daily dispatches = ~9 MB/month (Cost = $0.00).
- **Amazon CloudWatch**:
  - 10 custom metrics and 1,000,000 metric requests are included free in AWS Free Tier.
  - Sanchara Vyuha publishes 5 core metrics (`EmissionsAvoidedKg`, `FuelSavedLiters`, `EcoScore`, `EVFleetUtilizationPct`, `ActiveFleetCount`), consuming 0 billable metric slots beyond free tier (Cost = $0.00).

---

## 5. Teardown Instructions

To avoid any unexpected charges after testing:

1. Empty and delete the S3 bucket:
```bash
aws s3 rm s3://sanchara-vyuha-audit-archive-2026 --recursive
aws s3api delete-bucket --bucket sanchara-vyuha-audit-archive-2026 --region ap-south-1
```
2. Remove IAM credentials from `.env` and set `USE_AWS_MOCK=true`.
