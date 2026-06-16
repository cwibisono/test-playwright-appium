# TyrAds SDK QA Automation

Automation project for the Senior Automation QA SDK assignment. It covers:

- Web SDK/iframe validation with Playwright.
- TyrAds API validation with Playwright request fixtures.
- Android APK validation with WebdriverIO + Appium.
- Mobile screen recording via Appium.

## Repository Contents

- `QA Take Home Quiz.pdf` - original assignment brief.
- `example apps.apk` - Android Flutter sample app, package `com.tyrads.example`.
- `tests/api` - API smoke and data tests.
- `tests/web` - web SDK tests.
- `tests/mobile` - Android/Appium tests.
- `src` - API client, assertions, page objects, and screen objects.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` locally:

```bash
New-Item -ItemType File .env
```

Add at least:

```bash
TYRADS_WEB_TOKEN=the-token-from-email
```

The API defaults are defined in `config/env.ts`. If TyrAds gives exact API paths or header requirements, override these values in `.env`:

```bash
TYRADS_API_BASE_URL=https://api.tyrads.com/v4.0
TYRADS_OFFERS_PATH=campaigns
TYRADS_ACTIVE_OFFERS_PATH=campaigns/activated
TYRADS_ACTIVE_SUMMARY_PATH=campaigns/activated/summary
```

If the email/docs define exact auth headers, add them without changing code:

```bash
TYRADS_API_EXTRA_HEADERS_JSON={"Authorization":"Bearer xxx"}
```

## Run Web And API Tests

```bash
npm run test:web
```

Artifacts are written by Playwright on failure:

- `test-results/`
- `playwright-report/`

## Run API Only

```bash
npm run test:api
```

## Run Mobile Tests

Prerequisites:

- Android SDK installed.
- Emulator or real Android device available.
- Appium UiAutomator2 driver installed:

```bash
npx appium driver install uiautomator2
```

Then run:

```bash
npm run test:mobile
```

The mobile test installs `example apps.apk`, launches `com.tyrads.example.MainActivity`, walks through the initial SDK flow when possible, and saves screen recordings to `recordings/`.

## Notes For The Assignment

- The web token is time-limited to 7 days, so keep it outside git in `.env`.
- The provided SDK URL currently renders the offerwall as top-level content; the web tests validate that UI against API responses captured from browser network traffic.
- The APK is a Flutter release build signed with an Android debug certificate.
- Selectors are intentionally resilient because the repository does not include source code or stable test IDs.
- API signing/header names may need adjustment if TyrAds provides private API documentation with the assignment email.
