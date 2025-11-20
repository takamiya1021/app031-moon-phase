import { test, expect } from '@playwright/test';

test.describe('Moon Phase Viewer', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the main title and canvas', async ({ page }) => {
        await expect(page).toHaveTitle(/月の満ち欠け表示/);

        // Check for main heading
        const heading = page.getByRole('heading', { name: '月の満ち欠け表示' });
        await expect(heading).toBeVisible();

        // Check for Canvas
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('should display current date', async ({ page }) => {
        const now = new Date();
        // Format date as YYYY-MM-DD to match input value
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        // Check input value
        const dateInput = page.locator('#date-input');
        await expect(dateInput).toBeVisible();
        await expect(dateInput).toHaveValue(dateString);
    });

    test('should allow date navigation', async ({ page }) => {
        // Get initial date value
        const dateInput = page.locator('#date-input');
        const initialDate = await dateInput.inputValue();

        // Click next day button
        // The button has aria-label="翌日", so we use that name
        const nextButton = page.getByRole('button', { name: '翌日', exact: true });
        await expect(nextButton).toBeVisible();
        await nextButton.click();

        // Verify date changed (next day)
        // We can just check it's different for simplicity, or calculate exact next day
        await expect(dateInput).not.toHaveValue(initialDate);
    });

    test('should handle AI generation with dummy data', async ({ page }) => {
        const generateButton = page.getByRole('button', { name: '✨ AI情報を生成' });
        await expect(generateButton).toBeVisible();

        await generateButton.click();

        // Since no API key is set, it should show dummy data
        // Look for some dummy content or the section appearing
        const aiSection = page.locator('text=豆知識');
        await expect(aiSection).toBeVisible();
    });
});
