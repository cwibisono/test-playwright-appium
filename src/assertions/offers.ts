import { expect, Locator } from '@playwright/test';
import { offerIdentity, offerLabels, TyradsOffer } from '../api/tyradsApi';

export async function expectAtLeastOneApiOffer(offers: TyradsOffer[]): Promise<void> {
  expect(offers.length, 'API should return at least one offer/campaign').toBeGreaterThan(0);
}

export async function expectOfferVisibleInText(offers: TyradsOffer[], textLocator: Locator): Promise<void> {
  const uiText = await textLocator.innerText({ timeout: 15_000 });
  const normalizedUiText = uiText.toLowerCase();
  const visibleOffer = offers.find((offer) => {
    const id = offerIdentity(offer);
    const labels = offerLabels(offer);
    return Boolean(
      (id && uiText.includes(id)) ||
        labels.some((label) => label.length > 3 && normalizedUiText.includes(label.toLowerCase())),
    );
  });

  expect(
    visibleOffer,
    `Expected at least one API offer identity/name to appear in UI. API identities: ${offers.map(offerIdentity).join(', ')}`,
  ).toBeTruthy();
}
