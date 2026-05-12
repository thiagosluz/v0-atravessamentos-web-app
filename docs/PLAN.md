# System Update Plan - Documentation & Testing (Redis Integration)

Ensure the project documentation and testing suite are aligned with the new Vercel KV / Redis infrastructure.

## User Review Required

> [!IMPORTANT]
> The E2E tests might need to be adjusted to handle the new Rate Limiting logic. We will ensure the tests remain deterministic.

## Proposed Changes

### 1. Technical Documentation
#### [MODIFY] [README.md](file:///home/thiago/Projetos/v0-atravessamentos-web-app/README.md)
- Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to the environment variables section.
- Add a note about Redis/Vercel KV requirement for production stability.

#### [MODIFY] [ARCHITECTURE.md](file:///home/thiago/Projetos/v0-atravessamentos-web-app/ARCHITECTURE.md) (If exists)
- Update the system diagram to show Vercel KV sitting between the App and Supabase for caching.
- Document the Rate Limiting strategy (5 req/10s).

### 2. E2E Testing Suite
#### [MODIFY] [e2e/contact.spec.ts](file:///home/thiago/Projetos/v0-atravessamentos-web-app/e2e/contact.spec.ts)
- Update contact form tests to account for potential rate limiting.
- Add a new test case: "should block repeated submissions (Rate Limiting)".

#### [NEW] [e2e/redis_integration.spec.ts](file:///home/thiago/Projetos/v0-atravessamentos-web-app/e2e/redis_integration.spec.ts)
- Create a dedicated test to verify that the Acervo page loads faster on subsequent hits (visual check or timing).

## Verification Plan

### Automated Tests
- Run `pnpm test:e2e` to verify all flows.
- Run `lint_runner.py` to ensure documentation links are correct.

### Manual Verification
- Review the generated documentation files for clarity and completeness.
