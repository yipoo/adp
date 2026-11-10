# ADP Lifetime · Vercel / Stripe / Supabase

- Website: https://adp.yipoo.com/
- Account / checkout: https://adp.yipoo.com/account.html
- Lifetime: **USD $29.90 once**. No recurring subscription or automatic renewal.
- Existing public source remains free. Free includes all demos, responsive previews, search, local favorites, and Free-design prompts / code. Lifetime unlocks every online Pro prompt and framework export, bulk prompt management, the complete bilingual source ZIP, permanent use of downloaded versions, and updates while the product is maintained.
- Stripe is in **sandbox mode**. Live keys and live webhook events are rejected.

## Hosting and isolation

Vercel project `adp-yipoo`, team `yipoos-projects`. Custom domain `adp.yipoo.com` is bound to this project; the explicit `adp` CNAME is managed by Vercel DNS. Frontend and one Node 24 function are built through the Vercel Build Output API.

The selected Supabase development project is `motion-prompt` (`ozzutjxoxdoqvxsfemmn`). Authentication users are intentionally shared with the other product. **ADP billing records are separate**, in private schema `adp_billing`. All six tables have RLS enabled; browser roles have no grants or policies. Database access is server-only through the certificate-verified transaction pooler. ADP uses separate Stripe customer idempotency keys, catalog prices, portal configuration, webhook endpoint, and database transaction lock.

The `adp-downloads` Storage bucket is private. The server checks the user's paid Lifetime entitlement before returning a 60-second signed bundle URL. Never make the bucket public or place the private ZIP in static build output.

## Login

Supabase email magic links / OTP are supported with PKCE. The `adp-auth` browser storage key keeps this site's session separate from other sites. The allowed callbacks are:

- `https://adp.yipoo.com/account.html`
- `https://adp-yipoo.vercel.app/account.html`

The project's default Site URL is retained to avoid changing the other site's configuration. ADP always supplies its allowed callback explicitly. Supabase's default email service is intended for limited testing; configure a production sender before public customer acquisition. GitHub sign-in is not advertised or enabled.

## Payments and access

`POST /api/billing/checkout` accepts only a catalog SKU and stable `Idempotency-Key`. The server selects the customer, Price, amount, currency, one-time mode, and return URLs. Price mismatch and live-mode prices fail closed. Repeated network attempts reuse the same Checkout Session. A new paid purchase is rejected if the user already owns Lifetime.

Success-page query parameters never grant access. Stripe webhook signatures are checked over raw bytes; current Stripe session and line-item data must confirm payment for the configured Lifetime price. Fulfillment and the event ID are committed before acknowledging delivery. Duplicate events do not grant twice. Unpaid or delayed sessions never grant download access. No post-response worker is required.

Lifetime is a purchase record with **no expiry date**. The access lookup grants `lifetime: true` and `pro: true` for the `adp-lifetime` SKU. Refunds, disputes, and early fraud signals suspend access pending owner review; this handler does not move money or automatically restore access.

Customer Portal shows billing / invoice history. Obsolete ADP monthly and yearly sandbox Prices have been archived; the Lifetime catalog contains only `adp-lifetime`. The event handler retains subscription lifecycle support for compatibility, but no recurring plan is offered by this product.

## Online Pro exports

The Vercel public catalog contains empty prompt fields for Pro designs, and the static build includes source files for Free designs only. Pro framework files are packaged into the server function. `/resources/:id` and `/resources/prompts` both require an authenticated paid entitlement before any content is loaded. The client disables Pro copy / edit actions and bulk import / export for Free users. Existing publicly published GitHub versions remain available; this online feature gate does not retract public repository history or prevent inspection of public demo code.

## API

| Route | Access |
| --- | --- |
| `GET /public` | Public, publishable auth settings and Lifetime price only |
| `GET /health` | Public configuration readiness, not proof of payment |
| `GET /catalog` | Authenticated catalog |
| `POST /checkout` | Verified Supabase user, allowed origin, stable attempt key |
| `GET /resources/:id?lang=en&framework=react` | Lifetime-only Pro prompt / framework export |
| `GET /resources/prompts` | Lifetime-only bilingual bulk prompt export |
| `GET /entitlements` | This user's ADP access only |
| `POST /portal` | This user's mapped Stripe customer only |
| `GET /invoices` | This user's latest 20 invoices |
| `GET /downloads/source-bundle` | Paid Lifetime access; short-lived private signed URL |
| `POST /webhooks/stripe` | Stripe signature, synchronous idempotent fulfillment |

Prefix all routes with `/api/billing`. The deployed verifier checks the asymmetric JWT and validates the current user through Supabase Auth. No customer ids, amounts, Price ids, redirect URLs, or access flags are trusted from the browser.

## Configuration and deployment

Actual values are in ignored `billing/.env` and Vercel encrypted environment variables. See `vercel.env.example` for field names. Do not print secret values or put server keys in browser code. `PREMIUM_CONTENT_READY` remains false by default; enable it only after the actual bundle is uploaded and verified.

```sh
npm ci
npm ci --prefix billing
npm run check
npm run test:billing
npm run build:vercel
node tools/verify-static.mjs
node tools/sync-vercel-env.mjs production
vercel deploy --prebuilt --prod --scope yipoos-projects
```

Maintenance scripts `setup-sandbox.mjs` and `register-webhook.mjs` use stable Stripe idempotency keys and validate existing resources before reuse. Run them from the repository root with `node --env-file=billing/.env billing/<script>.mjs`. Do not automatically recreate an endpoint if its signing secret is unavailable.

`verify-deployed.mjs` is an explicit sandbox acceptance flow: creates temporary test identities, pauses for hosted test-card Checkout, checks deployed webhook fulfillment, owner-only ZIP download, invoice and portal access, then removes its test identities and mappings. It is not run by CI and never supports live keys.

## Tax and live launch

Tax collection is **not enabled**. Before real-money launch, confirm Stripe business activation, customer markets, refund / digital-content terms, product tax settings and active tax registrations. Enabling automatic tax without registrations is insufficient. The current build deliberately rejects live keys and live events, so deployment does not enable real charges.

References: [Stripe fulfillment](https://docs.stripe.com/checkout/fulfillment), [Stripe webhooks](https://docs.stripe.com/webhooks), [Supabase Auth](https://supabase.com/docs/guides/auth), [Supabase private Storage](https://supabase.com/docs/guides/storage/security/access-control).
