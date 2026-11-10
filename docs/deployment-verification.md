# ADP deployment verification — 2026-11-10

- Site: https://adp.yipoo.com (Vercel project `adp-yipoo`).
- Public repository: https://github.com/yipoo/adp.
- Free: all interactive demos and responsive previews, search, filters, local favorites, Free prompts and React / Next.js, Vue, HTML source.
- Lifetime: USD 29.90 one-time; all Pro prompts and framework source, bulk prompt tools, complete bilingual ZIP, and new Pro releases while actively maintained. No recurring offer.
- Both pricing and account pages include an eight-row comparison in English and Chinese. Mobile verification at 390px showed no horizontal overflow.
- Shared existing motion-prompt development Supabase Auth; ADP records isolated in private `adp_billing` schema. Existing product data unchanged. ADP login callbacks added without replacing shared Site URL.
- Pro prompt text and framework source excluded from public deployment assets. Server checks signed-in user and verified entitlement before resource or bulk exports. Previously published GitHub source remains publicly available.
- Complete source bundle stored in private `adp-downloads` bucket and delivered through short-lived signed links.
- 19 billing tests pass; all 138 bilingual framework source files compile; static artifact checks pass.
- Hosted Stripe sandbox checkout, webhook fulfillment, Lifetime entitlement and download flow tested on deployed HTTPS site. No real charge is enabled. Live merchant credentials, tax settings and production email delivery still require launch setup.
