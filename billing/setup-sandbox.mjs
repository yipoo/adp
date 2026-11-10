import fs from 'node:fs';
import Stripe from 'stripe';
if(!/^(rk|sk)_test_/.test(process.env.STRIPE_SECRET_KEY||''))throw Error('Sandbox key required');
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{apiVersion:'2026-10-28.endive',timeout:15000,maxNetworkRetries:1});
const products=(await stripe.products.list({limit:100})).data;
let product=products.find(p=>p.metadata.adp_sku==='lifetime');
if(!product)product=await stripe.products.create({name:'ADP Lifetime',description:'One-time access to the complete bilingual source bundle. Existing public source remains free.',metadata:{adp_sku:'lifetime',app:'adp'}},{idempotencyKey:'adp-product-lifetime-v1'});
const lookup='adp_lifetime_v1_usd_2990';let price=(await stripe.prices.list({lookup_keys:[lookup],limit:2})).data[0];
if(!price)price=await stripe.prices.create({product:product.id,unit_amount:2990,currency:'usd',lookup_key:lookup},{idempotencyKey:'adp-price-'+lookup});
if(price.livemode||!price.active||price.unit_amount!==2990||price.currency!=='usd'||price.recurring||price.product!==product.id)throw Error('Existing price conflicts with lifetime pricing');
const catalog=[{sku:'adp-lifetime',title:'ADP Lifetime',mode:'payment',price:price.id,amount:2990,currency:'usd',file:'adp-source-bundle.zip'}];
const features={invoice_history:{enabled:true},payment_method_update:{enabled:false},subscription_cancel:{enabled:false},subscription_update:{enabled:false}};
let portal=(await stripe.billingPortal.configurations.list({limit:100,active:true})).data.find(p=>p.metadata?.adp==='v1');
portal=portal?await stripe.billingPortal.configurations.update(portal.id,{features}):await stripe.billingPortal.configurations.create({metadata:{adp:'v1'},features});
// Retire only this application's unused sandbox subscriptions, never another app's prices.
let archived=0;for(const key of ['adp_pro_month_v1_usd','adp_pro_year_v1_usd']){for(const old of (await stripe.prices.list({lookup_keys:[key],limit:2})).data){const owner=products.find(p=>p.id===old.product);if(owner?.metadata.adp_sku!=='pro'||old.livemode)throw Error('Unexpected legacy price owner');if(old.active){await stripe.prices.update(old.id,{active:false});archived++}}}
let env=fs.readFileSync(new URL('.env',import.meta.url),'utf8');for(const [key,value] of Object.entries({BILLING_CATALOG:JSON.stringify(catalog),STRIPE_PORTAL_CONFIGURATION:portal.id})){const regex=new RegExp('^'+key+'=.*$','m');env=regex.test(env)?env.replace(regex,()=>key+'='+value):env+'\n'+key+'='+value+'\n'}fs.writeFileSync(new URL('.env',import.meta.url),env,{mode:0o600});fs.chmodSync(new URL('.env',import.meta.url),0o600);
console.log(JSON.stringify({sandbox:true,lifetimePrice:29.9,currency:'usd',recurring:false,legacySubscriptionPricesArchived:archived,portalConfigured:true,environmentUpdated:true}));
