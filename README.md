# Road to QHLAN 2028

Community campaign site for Brazilian QuakeWorld players traveling to QHLAN.

Public site: https://tibazera.github.io/roadtoqhlan/

## Development

Requires Node.js 24.

```sh
npm ci
npm run dev
```

## Validation

```sh
npx vitest run
npm run lint
npm run build
```

## Publishing

Push changes to `master`. GitHub Actions tests the project, exports the static site, and deploys it to GitHub Pages.

To reproduce the Pages build in PowerShell:

```powershell
$env:GITHUB_PAGES = "true"
$env:NEXT_PUBLIC_SITE_URL = "https://tibazera.github.io/roadtoqhlan/"
npm run build
```

The static export is written to `out/`. Local development keeps the server-based Next.js configuration and prototype preview.

## Content

- `src/content/site.ts`: team profiles, contact, FAQ, and campaign milestones.
- `src/content/ledger.ts`: verified fundraising figures and public financial records.
- `src/content/supporters.ts`: verified supporters who consented to publication.
- `public/team/`: player photos.

Donations remain disabled until the launch date and a hosted payment link are configured through `NEXT_PUBLIC_DONATION_URL`. Admin authentication is not connected; the admin page is informational. Never commit private donor information, credentials, or unredacted receipts.
