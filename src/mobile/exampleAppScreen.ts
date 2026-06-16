import { $, browser, expect } from '@wdio/globals';
import fs from 'node:fs';
import path from 'node:path';

export class ExampleAppScreen {
  private text(value: RegExp | string) {
    const source = value instanceof RegExp ? value.source : value;
    return $(`android=new UiSelector().textMatches("(?i).*${source}.*")`);
  }

  async waitUntilReady(): Promise<void> {
    await browser.waitUntil(
      async () => {
        const currentPackage = await browser.getCurrentPackage();
        return currentPackage === 'com.tyrads.example';
      },
      { timeout: 45_000, timeoutMsg: 'Expected Flutter app to become ready' },
    );
    await browser.pause(5_000);
  }

  async acceptIntroIfPresent(): Promise<void> {
    const candidates = [
      this.text(/accept|agree|continue|allow|next|start/),
    ];

    for (const candidate of candidates) {
      if (await candidate.isExisting()) {
        await candidate.click();
        await browser.pause(1_000);
      }
    }
  }

  async openOffersIfPresent(): Promise<void> {
    const offersButton = this.text(/offer|more offers|active offers|campaign/);
    if (await offersButton.isExisting()) {
      await offersButton.click();
      await browser.pause(2_000);
    }
  }

  async expectOfferwallContent(): Promise<void> {
    const screenshotsDir = path.resolve('recordings');
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await browser.saveScreenshot(path.join(screenshotsDir, `mobile-${Date.now()}.png`));

    const currentPackage = await browser.getCurrentPackage();
    expect(currentPackage).toBe('com.tyrads.example');

    const offerLikeText = this.text(/offer|reward|campaign|coin|bonus|active|no offers/);
    if (await offerLikeText.isExisting()) {
      await expect(offerLikeText).toBeExisting();
    }
  }
}
