import { APIRequestContext, expect } from '@playwright/test';
import crypto from 'node:crypto';
import { env } from '../../config/env';

export type TyradsOffer = {
  campaignId?: string | number;
  campaignID?: string | number;
  campaign_id?: string | number;
  campaignName?: string;
  campaign_name?: string;
  name?: string;
  title?: string;
  appName?: string;
  app_name?: string;
  offerName?: string;
  offer_name?: string;
  reward?: unknown;
  [key: string]: unknown;
};

export type TyradsApiResponse<T> = {
  code?: number;
  message?: string;
  data?: T;
  [key: string]: unknown;
};

function cleanPath(path: string): string {
  return path.replace(/^\/+/, '');
}

function signature(method: string, path: string, body = ''): string {
  const payload = `${method.toUpperCase()}\n/${cleanPath(path)}\n${body}`;
  return crypto.createHmac('sha256', env.apiSecret).update(payload).digest('hex');
}

function extraHeaders(): Record<string, string> {
  try {
    return JSON.parse(env.apiExtraHeadersJson) as Record<string, string>;
  } catch (error) {
    throw new Error(`TYRADS_API_EXTRA_HEADERS_JSON must be valid JSON: ${(error as Error).message}`);
  }
}

export class TyradsApi {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(path: string): Promise<TyradsApiResponse<T>> {
    const apiPath = cleanPath(path);
    const response = await this.request.get(`${env.apiBaseUrl}/${apiPath}`, {
      headers: {
        Accept: 'application/json',
        'X-Api-Key': env.apiKey,
        'X-API-Key': env.apiKey,
        'X-Api-Signature': signature('GET', apiPath),
        'X-Encryption-Key': env.encryptionKey,
        ...extraHeaders(),
      },
    });

    const body = await response.text();
    expect(response.ok(), `GET ${apiPath} failed with ${response.status()}: ${body}`).toBeTruthy();
    return JSON.parse(body) as TyradsApiResponse<T>;
  }

  async getOffers(): Promise<TyradsOffer[]> {
    const json = await this.get<unknown>(env.offersPath);
    return extractOffers(json);
  }

  async getActiveOffers(): Promise<TyradsOffer[]> {
    const json = await this.get<unknown>(env.activeOffersPath);
    return extractOffers(json);
  }
}

export function extractOffers(payload: unknown): TyradsOffer[] {
  if (Array.isArray(payload)) {
    return payload as TyradsOffer[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const objectPayload = payload as Record<string, unknown>;
  const candidates = [
    objectPayload.data,
    objectPayload.campaigns,
    objectPayload.offers,
    objectPayload.items,
    objectPayload.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as TyradsOffer[];
    }

    if (candidate && typeof candidate === 'object') {
      const nested = extractOffers(candidate);
      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
}

export function offerIdentity(offer: TyradsOffer): string {
  return String(
    offer.campaignId ??
      offer.campaignID ??
      offer.campaign_id ??
      offer.id ??
      offer.campaignName ??
      offer.campaign_name ??
      offer.name ??
      offer.title ??
      offer.appName ??
      offer.app_name ??
      offer.offerName ??
      offer.offer_name ??
      '',
  );
}

export function offerLabels(offer: TyradsOffer): string[] {
  const labels = new Set<string>();
  const interestingKeys = /(^|_)(campaign|offer|app)?_?(name|title)$/i;

  function visit(value: unknown, key = ''): void {
    if (typeof value === 'string') {
      if (interestingKeys.test(key) || value.length > 3) {
        labels.add(value);
      }
      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }

    for (const [childKey, childValue] of Object.entries(value)) {
      visit(childValue, childKey);
    }
  }

  visit(offer);
  return [...labels];
}
