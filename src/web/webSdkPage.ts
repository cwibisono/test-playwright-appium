import { expect, Locator, Page } from '@playwright/test';
import { env } from '../../config/env';

export class WebSdkPage {
  constructor(private readonly page: Page) {}

  async open(token: string): Promise<void> {
    const url = new URL(env.webBaseUrl);
    url.searchParams.set('token', token);
    await this.page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  rootText(): Locator {
    return this.page.locator('main, body').first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.rootText(), 'SDK should render visible content').not.toHaveText('', { timeout: 20_000 });
    await expect(this.page.getByText(/offers|premium games|other games/i).first()).toBeVisible();
  }

  primaryCta(): Locator {
    return this
      .page
      .getByRole('button')
      .filter({ hasText: /accept|continue|start|more offers|offers|active|claim|allow|next|play now|earn now/i })
      .first();
  }

  async clickPrimaryCtaIfPresent(): Promise<boolean> {
    const cta = this.primaryCta();
    try {
      await cta.waitFor({ state: 'visible', timeout: 8_000 });
      await cta.click();
      return true;
    } catch {
      return false;
    }
  }
}
