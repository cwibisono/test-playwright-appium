import { test } from '@playwright/test';
import { requireWebToken } from '../../config/env';
import { expectAtLeastOneApiOffer, expectOfferVisibleInText } from '../../src/assertions/offers';
import { collectOfferApiResponses } from '../../src/web/network';
import { WebSdkPage } from '../../src/web/webSdkPage';

test.describe('TyrAds web SDK iframe', () => {
  test('loads SDK, exercises primary CTA, and matches frontend API campaign data', async ({ page }) => {
    const token = requireWebToken();
    const sdk = new WebSdkPage(page);

    const frontendApiOffers = await collectOfferApiResponses(page, async () => {
      await sdk.open(token);
      await sdk.expectLoaded();
      await sdk.clickPrimaryCtaIfPresent();
    });

    await expectAtLeastOneApiOffer(frontendApiOffers);
    await expectOfferVisibleInText(frontendApiOffers, sdk.rootText());
  });
});
