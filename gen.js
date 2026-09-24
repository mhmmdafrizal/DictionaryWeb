const fs = require("fs");
const path = "tests/e2e-security.spec.ts";
const lines = [
  `import { test, expect } from "@playwright/test";`,
  ``,
  `test.describe("Dictionary App E2E Security Tests", () => {`,
  `  test("page loads", async ({ page }) => {`,
  `    await page.goto("/");`,
  `    await expect(page).toHaveTitle(/Dictionary/);`,
  `  });`,
  ``,
  `  test("search input works", async ({ page }) => {`,
  `    await page.goto("/");`,
  `    await expect(page.locator(`input[placeholder="Search"]`)).toBeVisible();`,
  `  });`,
  ``,
  `  test("XSS prevention - script not executed", async ({ page }) => {`,
  `    await page.goto("/");`,
  `    await page.fill(`input[placeholder="Search"]`, "<script>alert(1)</script>");`,
  `    await page.press(`input[placeholder="Search"]`, "Enter");`,
  `    await page.waitForLoadState("networkidle");`,
  `    const bodyText = await page.textContent("body");`,
  `    expect(bodyText).not.toContain("alert(1)");`,
  `  });`,
  ``,
  `  test("no console errors", async ({ page }) => {`,
  `    const consoleErrors = [];`,
  `    page.on("console", (msg) => {`,
  `      if (msg.type() === "error") {`,
  `        consoleErrors.push(msg.text());`,
  `      }`,
  `    });`,
  `    await page.goto("/");`,
  `    await page.waitForLoadState("networkidle");`,
  `    expect(consoleErrors).toEqual([]);`,
  `  });`,
  `});`,
  ``
];
const content = lines.join("\n");
fs.writeFileSync(path, content, "utf8");
console.log("Wrote", content.length, "chars to", path);
