import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';
import { ExampleAppScreen } from '../../src/mobile/exampleAppScreen';

describe('TyrAds Android example app', () => {
  const recordingsDir = path.resolve('recordings');

  before(async () => {
    fs.mkdirSync(recordingsDir, { recursive: true });
    await browser.startRecordingScreen();
  });

  after(async () => {
    const video = await browser.stopRecordingScreen();
    if (video) {
      fs.writeFileSync(path.join(recordingsDir, `mobile-${Date.now()}.mp4`), Buffer.from(video, 'base64'));
    }
  });

  it('opens the SDK offerwall flow', async () => {
    const app = new ExampleAppScreen();

    await app.waitUntilReady();
    await app.acceptIntroIfPresent();
    await app.openOffersIfPresent();
    await app.expectOfferwallContent();
  });
});
