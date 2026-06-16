import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

function optional(name: string, fallback = ''): string {
  return process.env[name]?.trim() || fallback;
}

function required(name: string): string {
  const value = optional(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  webToken: optional('TYRADS_WEB_TOKEN'),
  webBaseUrl: optional('TYRADS_WEB_BASE_URL', 'https://v4.sdk.tyrads.com'),
  apiBaseUrl: optional('TYRADS_API_BASE_URL', 'https://api.tyrads.com/v4.0').replace(/\/$/, ''),
  apiKey: optional('TYRADS_API_KEY', '0a55de10c58f459c9f65988d9d33e774'),
  apiSecret: optional(
    'TYRADS_API_SECRET',
    '418fc08c18a6715b48428568946e6f82f0ff06bfbc017944d22a19b3317a5ce2ad7028b0599a149534d957017d54650a9fa355cebf6971d7fdbc3eca372ca4ed',
  ),
  encryptionKey: optional('TYRADS_ENCRYPTION_KEY', 'VKdZsSz9&3WQqA6xfBJ4G2!5cUe8Y7yP'),
  offersPath: optional('TYRADS_OFFERS_PATH', 'campaigns'),
  activeOffersPath: optional('TYRADS_ACTIVE_OFFERS_PATH', 'campaigns/activated'),
  activeSummaryPath: optional('TYRADS_ACTIVE_SUMMARY_PATH', 'campaigns/activated/summary'),
  apiExtraHeadersJson: optional('TYRADS_API_EXTRA_HEADERS_JSON', '{}'),
  appiumServerUrl: optional('APPIUM_SERVER_URL', 'http://127.0.0.1:4723'),
  androidDeviceName: optional('ANDROID_DEVICE_NAME', 'Android Emulator'),
  androidPlatformVersion: optional('ANDROID_PLATFORM_VERSION'),
  apkPath: path.resolve(optional('APK_PATH', 'example apps.apk')),
};

export function requireWebToken(): string {
  return required('TYRADS_WEB_TOKEN');
}
