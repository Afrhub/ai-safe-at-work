// Page object for a module page's knowledge check, the thing that actually completes
// the course. Modules 2 to 12 are scored by record_quiz_result, so the page shows no
// verdict per question: it takes the answer and moves on, then marks the lot at the end.

import { BASE } from "../lib/browser.mjs";

export class ModuleQuizPage {
  constructor(page, record) {
    this.page = page;
    this.record = record;

    this.mount = page.locator("#quiz-mount");
    this.startButton = page.getByRole("button", { name: /Start the quiz/ });
    this.options = page.locator(".quiz-option");
    this.end = page.locator(".quiz-end");
    this.score = page.locator(".score-num");
    this.verdict = page.locator(".verdict-line");
    this.certLink = page.getByRole("link", { name: /Print my certificate/ });
    this.scoreError = page.locator(".quiz-feedback.wrong-fb");
  }

  async open(moduleNumber) {
    await this.page.goto(`${BASE}/module-${moduleNumber}.html`, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    return this;
  }

  // Answers every question with the seeded key, then waits for the server's mark.
  // Returns { score, total, passed, certLink }.
  async completeWith(answers) {
    await this.startButton.click();
    for (let q = 0; q < answers.length; q++) {
      const option = this.options.nth(answers[q]);
      await option.waitFor({ state: "visible", timeout: 15_000 });
      await option.click();
      // The last click submits, everything before it re-renders the next question.
      if (q < answers.length - 1) {
        await this.page.waitForFunction(
          (n) => {
            const counter = document.querySelector(".quiz-counter");
            return counter && counter.textContent.includes(`Question ${n} of`);
          },
          q + 2,
          { timeout: 15_000 }
        );
      }
    }

    await this.page.waitForFunction(
      () => document.querySelector(".quiz-end") || document.querySelector(".quiz-feedback.wrong-fb"),
      { timeout: 45_000 }
    );

    if (!(await this.end.count())) {
      throw new Error(`the quiz could not be marked: ${(await this.scoreError.innerText()).trim()}`);
    }
    const scoreText = (await this.score.textContent()).trim();
    const verdict = (await this.verdict.textContent()).trim();
    return {
      score: Number(scoreText),
      verdict,
      passed: verdict.startsWith("✓"),
      certLink: (await this.certLink.count()) ? await this.certLink.getAttribute("href") : null,
    };
  }
}
