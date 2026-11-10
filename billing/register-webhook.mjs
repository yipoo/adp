import fs from 'node:fs';
import Stripe from 'stripe';
import { createHash } from 'node:crypto';
import { EVENTS } from './service.mjs';
const base=new URL(process.argv[2]);
if(base.protocol!=='https:'||!['adp.yipoo.com','adp-yipoo.vercel.app'].includes(base.hostname))throw Error('Expected an approved ADP HTTPS deployment URL');
if(!/^(rk|sk)_test_/.test(process.env.STRIPE_SECRET_KEY||''))throw Error('Sandbox key required');
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{apiVersion:'2026-10-28.endive',timeout:15000,maxNetworkRetries:1});
const url=new URL('/api/billing/webhooks/stripe',base).href;
const endpoints=(await stripe.webhookEndpoints.list({limit:100})).data;
let endpoint=endpoints.find(e=>e.url===url)||endpoints.find(e=>e.url==='https://adp-yipoo.vercel.app/api/billing/webhooks/stripe'&&e.description==='ADP Vercel sandbox');
if(endpoint&&endpoint.url!==url)endpoint=await stripe.webhookEndpoints.update(endpoint.id,{url});
if(!endpoint)endpoint=await stripe.webhookEndpoints.create({url,api_version:'2026-10-28.endive',enabled_events:[...EVENTS],description:'ADP Vercel sandbox'},{idempotencyKey:'adp-webhook-'+createHash('sha256').update(url).digest('hex').slice(0,32)});
let env=fs.readFileSync(new URL('.env',import.meta.url),'utf8');
const updates={SITE_URL:base.origin+'/',ALLOWED_ORIGIN:base.origin,...(endpoint.secret?{STRIPE_WEBHOOK_SECRET:endpoint.secret}:{})};
if(!endpoint.secret&&!process.env.STRIPE_WEBHOOK_SECRET)throw Error('Endpoint already exists; retrieve its signing secret from Stripe Workbench without recreating it');
for(const [key,value] of Object.entries(updates)){
 const regex=new RegExp(`^${key}=.*$`,'m');env=regex.test(env)?env.replace(regex,()=>key+'='+value):env+'\n'+key+'='+value+'\n';
}
fs.writeFileSync(new URL('.env',import.meta.url),env,{mode:0o600});fs.chmodSync(new URL('.env',import.meta.url),0o600);
console.log(JSON.stringify({sandbox:true,webhookConfigured:true,eventCount:EVENTS.size,environmentUpdated:true}));
