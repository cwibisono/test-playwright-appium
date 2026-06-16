import { test } from '@playwright/test';
import { TyradsApi } from '../../src/api/tyradsApi';
import { expectAtLeastOneApiOffer } from '../../src/assertions/offers';

test.describe('TyrAds API', () => {
  test('returns campaign/offer data for the configured credentials', async ({ request }) => {
    const api = new TyradsApi(request);
    const offers = await api.getOffers();

    await expectAtLeastOneApiOffer(offers);
  });
});
