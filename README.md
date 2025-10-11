# 🚀 PayTask MVP -- VIBE CODE https://paytaskmvp.vercel.app/ -- The main REPO -- BUILDING - https://github.com/PayTaskdz

> **Universal microtask exchange on Solana — instant stablecoin rewards for micro-labor.**

---

## What is PayTask?

PayTask enables anyone to post or complete micro-tasks ($0.50–$50) with instant stablecoin payments on Solana.

**The Problem:** Web2 payment fees ($0.30+ fixed) make tasks under $5 unprofitable. This kills 95% of micro-work opportunities — a $500B stranded market.

**The Solution:** Solana stablecoin escrow ($0.00025 fees) makes micropayments viable for the first time. Workers earn instantly, clients get proof-of-human work AI can't fake.

---

## Key Features

- ✅ **Escrow-protected payments** — funds locked until completion or 48h auto-release
- ⚡ **Instant USDC/USDT payouts** — sub-second settlement, borderless
- ⭐ **On-chain reputation** — portable ratings, completion tracking
- 🔍 **Quality assurance** — proof submissions + LLM screening + disputes
- 📱 **Mobile-first** — 1-tap acceptance, 3-tap posting flow
- 🌍 **Global access** — no minimums, KYC only at $200+

---

## Use Cases

**Workers:** Earn $3-6 in 15 minutes (surveys, UX testing, AI labeling, local research)  
**AI Companies:** Human validation 10x cheaper than Scale AI  
**Businesses:** On-demand micro-research and proof-of-action tasks  

---

## Quick Start



 Frontend
```

---

## Project Structure

```
paytask-mvp/
├── programs/
│   └── paytask/          # Anchor smart contracts (Rust)
│       ├── src/
│       │   ├── lib.rs           # Program entrypoint
│       │   ├── instructions/    # Task, escrow, payout logic
│       │   └── state/           # Account schemas
│       └── tests/
├── app/
│   ├── backend/          # Node.js API + indexer
│   │   ├── src/
│   │   │   ├── api/            # REST endpoints
│   │   │   ├── services/       # Business logic
│   │   │   ├── models/         # PostgreSQL schemas
│   │   │   └── indexer/        # Solana event listener
│   │   └── tests/
│   └── frontend/         # Next.js web + React Native mobile
│       ├── components/
│       ├── pages/
│       └── hooks/
├── docs/                 # API docs, architecture diagrams
└── scripts/              # Deployment, migration tools
```

---

## Core Workflows

### Worker Flow
```
Browse tasks → Accept (1-tap) → Complete work → Submit proof → Get paid instantly
```

### Client Flow
```
Create task → Fund escrow → Workers complete → Review/Auto-approve → Funds released
```

### Smart Contract Flow
```
Client → escrow_lock() → Task published
Worker → accept_task() → Assignment created  
Worker → submit_work() → QA checks run
Client → approve() → payout_release() → Worker receives USDC
OR timeout → auto_approve() → payout_release()
```

```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Solana (400ms finality, $0.00025 fees) |
| Smart Contracts | Anchor (Rust) |
| Backend | Node.js, Express, PostgreSQL |
| Frontend | Next.js, React Native, TailwindCSS |
| Payments | USDC/USDT escrow, time-lock + multi-sig |
| Auth | Wallet signatures, email OTP (custodial) |
| QA | OpenAI API (content moderation) |
| Infrastructure | AWS, Railway, Vercel |

```

## API Endpoints
```
### Authentication
- `POST /auth/signup-email` — Email + OTP signup (custodial wallet)
- `POST /auth/signup-wallet` — External wallet connect
- `POST /auth/login` — Login (email or wallet signature)

### Tasks
- `POST /tasks/create` — Create draft task
- `POST /tasks/{id}/fund` — Fund escrow
- `POST /tasks/{id}/publish` — Publish funded task
- `GET /tasks/discover` — Browse open tasks (worker)
- `POST /tasks/{id}/accept` — Accept task (worker)

### Submissions
- `POST /submissions/create` — Submit completed work
- `PUT /submissions/{id}/update` — Resubmit after fix request
- `GET /submissions/{id}` — View submission details

### Reviews
- `POST /reviews/{id}/approve` — Approve + trigger payout
- `POST /reviews/{id}/request-fix` — Request revision
- `POST /reviews/{id}/reject` — Reject submission

[Full API docs →](docs/API.md)

---

## Key Metrics

**North Star:** Filled Minutes per Day (total worker-time matched)

**KPIs:**
- Fill Rate: >85% (tasks completed within 24h)
- TTFP: <5 min (time to first pickup)
- Approval SLA: >90% (reviewed within 6h)
- Dispute Rate: <3%
- Repeat Client: >40%

---

## Roadmap

**Phase 1: MVP** *(Current)*  
Single-slot tasks, escrow, reputation v0, auto-approve SLA

**Phase 2: Scale** *(Q2 2025)*  
Multi-quantity tasks, advanced disputes, enterprise API

**Phase 3: Ecosystem** *(Q3 2025)*  
Freelance integration, job-finding, AI-assisted QA, reputation NFTs

---

## Security

- ✅ Smart contracts audited by [Auditor] (report pending)
- ✅ Bug bounty: up to $50k for critical vulnerabilities
- ✅ Report: security@paytask.app

---

## Contributing

We welcome PRs! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Priority areas:** Smart contract audits, mobile UX, QA algorithms, localization

**Core Contributors:**
- Huy Đống — Product Lead
- Đăng Duy — Smart Contracts
- Duy Nguyen — Backend & Indexer
- Subin — Frontend & Mobile
- Hưng Phan — QA & Testing

---
