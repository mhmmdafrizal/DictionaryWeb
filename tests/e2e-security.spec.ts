import { test, expect } from "@playwright/test";
test.describe("Dictionary App E2E Security Suite", () => {
  test("page loads with title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Dictionary/);
  });
  test("search input visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("input[placeholder=\"Search\"]")).toBeVisible();
  });
  test("XSS payload not executed", async ({ page }) => {
    await page.goto("/");
    await page.fill("input[placeholder=\"Search\"]", "<script>alert(1)</script>");
    await page.press("input[placeholder=\"Search\"]", "Enter");
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).not.toContain("alert(1)");
  });
  test("no console errors", async ({ page }) => {
    const errs: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errs).toEqual([]);
  });
});
