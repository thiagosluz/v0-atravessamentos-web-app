# Verification and Documentation Plan

This plan outlines the steps to verify the recent UI/UX standardizations and ensure all documentation and tests are up to date.

## User Review Required

> [!IMPORTANT]
> This plan focuses on verifying the visual and structural reforms made to the internal pages and the admin dashboard. No functional logic changes are expected, but regressions in navigation and layout will be checked.

## Proposed Changes

### 1. Documentation Updates
#### [MODIFY] [COMPONENTS.md](file:///home/thiago/Projetos/v0-atravessamentos-web-app/docs/COMPONENTS.md)
- Add documentation for `PageHeader` component.
- Add documentation for `BackgroundBlobs` component.
- Update `BackButton` documentation with usage examples in internal pages.

#### [MODIFY] [ADMIN_GUIDE.md](file:///home/thiago/Projetos/v0-atravessamentos-web-app/docs/ADMIN_GUIDE.md)
- Update descriptions of the Gallery and Exhibitions admin panels with the new standardized layout.

### 2. Test Verification
#### [NEW] [ui_standardization.spec.ts](file:///home/thiago/Projetos/v0-atravessamentos-web-app/e2e/ui_standardization.spec.ts)
- Create a new Playwright test to verify that internal pages (`/acervo`, `/exposicoes`, `/diario`, `/projetos`) contain the `PageHeader` and `BackButton`.

#### [MODIFY] [cms.spec.ts](file:///home/thiago/Projetos/v0-atravessamentos-web-app/e2e/cms.spec.ts)
- Ensure admin dashboard tests still pass with the new spacing and header structure.

## Verification Plan

### Automated Tests
- Run `pnpm test` (Vitest) to ensure no regressions in business logic.
- Run `pnpm test:e2e` (Playwright) to verify navigation and the new UI structure.
- Run `pnpm lint` to ensure code quality.
- Run `pnpm build` to verify no compilation errors.

### Manual Verification
- Visual check of the internal pages to ensure the "Editorial" theme is consistent.
- Visual check of the admin dashboard to verify the "respiro" (spacing) in Gallery and Exhibitions.
