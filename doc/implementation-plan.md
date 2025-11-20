# Implementation Plan - E2E Testing with Playwright

## Goal Description
Set up End-to-End (E2E) testing using Playwright to verify the application's functionality from a user's perspective. This will cover the main user flows: viewing the moon phase, changing dates, and generating AI content.

## User Review Required
> [!NOTE]
> This plan prioritizes E2E testing over PWA implementation as requested.

## Proposed Changes

### Configuration
#### [NEW] Playwright Setup
- Install Playwright with TypeScript support.
- Configure `playwright.config.ts` for the project.
- Add `test:e2e` script to `package.json`.

### Tests
#### [NEW] [e2e/moon-phase.spec.ts](file:///home/ustar-wsl-2-2/projects/100apps/app031-moon-phase/e2e/moon-phase.spec.ts)
- **Scenario 1: Initial Load**
  - Verify page title "月の満ち欠け表示".
  - Verify Canvas element exists.
  - Verify current date is displayed.
- **Scenario 2: Date Selection**
  - Click "Next Day" button.
  - Verify date updates.
  - Verify Moon Phase name updates (if applicable).
- **Scenario 3: AI Generation (Mocked)**
  - Mock the API response.
  - Click "AI情報を生成" button.
  - Verify loading state.
  - Verify content appears.

### Visual Enhancements
#### [NEW] Moon Realism
- **Textures**: Replace simple texture with high-res diffuse and normal/bump maps.
- **Material**: Tune `meshStandardMaterial` for realistic roughness and light interaction.
- **Lighting**: Verify sun position accuracy for phases.


## Verification Plan

### Automated Tests
- Run `npm run test:e2e` (or `npx playwright test`) to execute the new E2E tests.
- Ensure all tests pass in a headless browser.
- Verify that the tests correctly fail when assertions are broken (sanity check).

### Manual Verification
- None required for this phase as it IS the verification layer.
