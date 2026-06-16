import { Page, Response } from '@playwright/test';
import { extractOffers, TyradsOffer } from '../api/tyradsApi';

export async function collectOfferApiResponses(page: Page, action: () => Promise<void>): Promise<TyradsOffer[]> {
  const responsePromises: Promise<TyradsOffer[]>[] = [];

  page.on('response', (response: Response) => {
    if (!/api\.tyrads\.com|sdk\.tyrads\.com/i.test(response.url())) {
      return;
    }

    responsePromises.push(
      response
        .json()
        .then((json) => extractOffers(json))
        .catch(() => []),
    );
  });

  await action();
  await page.waitForTimeout(3_000);

  const groups = await Promise.all(responsePromises);
  return groups.flat();
}
