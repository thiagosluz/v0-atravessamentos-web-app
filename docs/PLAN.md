# Verification Plan - Debugging & Test Robustness

This plan focuses on fixing the E2E test failures caused by non-unique selectors and ensuring the UI standardization is correctly verified.

## User Review Required

> [!IMPORTANT]
> We will modify the `PageHeader` component to add `data-testid` attributes. This is a best practice for testing and will not affect the production UI.

## Proposed Changes

### 1. Component Refinement
#### [MODIFY] [page-header.tsx](file:///home/thiago/Projetos/v0-atravessamentos-web-app/components/ui/page-header.tsx)
- Add `data-testid="page-header"` to the main `<header>` tag.
- Add `data-testid="page-header-description"` to the `<motion.p>` tag.

### 2. Test Refactoring
#### [MODIFY] [ui_standardization.spec.ts](file:///home/thiago/Projetos/v0-atravessamentos-web-app/e2e/ui_standardization.spec.ts)
- Update locators to use `data-testid` for the `PageHeader` description.
- Ensure the tests are resilient to background elements like the Command Menu.

## Verification Plan

### Automated Tests
- Run `pnpm test:e2e` specifically for `ui_standardization.spec.ts`.
- Run all E2E tests to ensure no regressions.
- Run `pnpm lint` and `pnpm build`.

### Manual Verification
- Verify that the `data-testid` attributes are correctly rendered in the DOM using the browser tool.
