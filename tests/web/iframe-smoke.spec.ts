import { test } from '@playwright/test';
import { requireWebToken } from '../../config/env';
import { WebSdkPage } from '../../src/web/webSdkPage';

test.describe('TyrAds web SDK iframe smoke', () => {
  test('loads the SDK iframe with the assignment token', async ({ page }) => {
    const sdk = new WebSdkPage(page);

    await sdk.open(requireWebToken());
    await sdk.expectLoaded();
    await sdk.clickPrimaryCtaIfPresent();
  });
});
