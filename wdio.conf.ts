import path from 'node:path';
import type { Options } from '@wdio/types';
import { env } from './config/env';

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./tests/mobile/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 20_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 1,
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: new URL(env.appiumServerUrl).hostname,
          port: Number(new URL(env.appiumServerUrl).port || 4723),
          relaxedSecurity: true,
        },
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 180_000,
  },
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': env.androidDeviceName,
      ...(env.androidPlatformVersion ? { 'appium:platformVersion': env.androidPlatformVersion } : {}),
      'appium:app': path.resolve(env.apkPath),
      'appium:appPackage': 'com.tyrads.example',
      'appium:appActivity': 'com.tyrads.example.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 180,
    },
  ],
};
