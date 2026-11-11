// Real DEVELOPMENT auth/database + real Stripe SANDBOX + deployed HTTPS API.
// Pauses for one hosted sandbox checkout, then verifies fulfillment and cleans its test data.
import assert from 'node:assert/strict';
import {randomUUID,randomBytes,createHash} from 'node:crypto';
import {writeFile,mkdir} from 'node:fs/promises';
import {createInterface} from 'node:readline/promises';
import Stripe from 'stripe';
import {createClient} from '@supabase/supabase-js';
import {openPostgres} from './postgres.mjs';
const base='https://adp.yipoo.com';
if(!/^(rk|sk)_test_/.test(process.env.STRIPE_SECRET_KEY||'')||process.env.SUPABASE_URL!=='https://ozzutjxoxdoqvxsfemmn.supabase.co')throw Error('Approved development and sandbox configuration required');
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{apiVersion:'2026-10-28.endive',maxNetworkRetries:1,timeout:12000});
const admin=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const auth=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const otherAuth=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const store=openPostgres(process.env.DATABASE_URL);const report={sandbox:true,deployedBase:base};const users=[],requestKeys=[];let checkout,customer,user,token;
const folder=new URL('../.oil-ui/source-check/',import.meta.url);await mkdir(folder,{recursive:true});
async function newUser(client){const email='adp-check-'+randomUUID()+'@example.invalid',password=randomBytes(32).toString('base64url');const created=await admin.auth.admin.createUser({email,password,email_confirm:true,app_metadata:{adp_verification:true}});assert.ifError(created.error);users.push(created.data.user.id);const signed=await client.auth.signInWithPassword({email,password});assert.ifError(signed.error);return{user:created.data.user,token:signed.data.session.access_token}}
async function api(route,options={},jwt=token){return fetch(base+'/api/billing'+route,{...options,headers:{...(jwt?{Authorization:'Bearer '+jwt}:{}),...options.headers}})}
try{
 assert.equal((await api('/entitlements',{},null)).status,401);report.unauthenticatedRejected=true;
 ({user,token}=await newUser(auth));assert.equal((await api('/entitlements')).status,200);report.authenticatedApi=true;
 const key=randomUUID();requestKeys.push(key);const options={method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({sku:'adp-lifetime',language:'en'})};
 const response=await api('/checkout',options);assert.equal(response.status,200,'Deployed checkout unavailable');const result=await response.json();assert.equal(new URL(result.url).hostname,'checkout.stripe.com');customer=await store.customer(user.id);assert(customer);checkout=(await stripe.checkout.sessions.list({customer,status:'open',limit:100})).data.find(s=>s.url===result.url);assert(checkout);assert.equal(checkout.livemode,false);assert.equal(checkout.mode,'payment');assert.equal(checkout.amount_total,2990);assert.equal(checkout.currency,'usd');assert(checkout.success_url.startsWith(base+'/account.html'));assert(checkout.invoice_creation.enabled);
 const replay=await api('/checkout',options);assert.equal(replay.status,200);assert.equal((await replay.json()).url,result.url);report.checkout={created:true,idempotent:true,amount:2990,currency:'usd',mode:'payment',canonicalRedirect:true};
 assert.equal((await(await api('/entitlements')).json()).pro,false);assert.equal((await api('/downloads/source-bundle')).status,403);report.unpaidCannotDownload=true;assert.equal((await api('/resources/agent-research?lang=en&framework=react')).status,403);assert.equal((await api('/resources/prompts')).status,403);report.freeCannotExportPro=true;
 await writeFile(new URL('checkout.json',folder),JSON.stringify({url:checkout.url}),{mode:0o600});console.log('HOSTED_CHECKOUT_READY');console.log(checkout.url);console.log('Complete this SANDBOX checkout, then type verify. No real money is charged.');
 const reader=createInterface({input:process.stdin,output:process.stdout});const action=await reader.question('Action: ');reader.close();assert.equal(action.trim(),'verify');
 checkout=await stripe.checkout.sessions.retrieve(checkout.id);assert.equal(checkout.payment_status,'paid','Sandbox payment not completed');report.hostedPaymentPaid=true;
 let access;for(let attempt=0;attempt<12;attempt++){access=await(await api('/entitlements')).json();if(access.lifetime)break;await new Promise(r=>setTimeout(r,2000))}assert.equal(access.lifetime,true,'Webhook did not grant lifetime');assert.equal(access.pro,true);report.verifiedWebhookGrantedLifetime=true;
 const proResource=await api('/resources/agent-research?lang=en&framework=react');assert.equal(proResource.status,200);const proData=await proResource.json();assert(proData.code.startsWith('\"use client\"'));assert(proData.prompt.length>500);const bulk=await api('/resources/prompts');assert.equal(bulk.status,200);assert.equal((await bulk.json()).length,46);report.proResourceAndBulkAccess=true;
 const download=await api('/downloads/source-bundle');assert.equal(download.status,200);const signedURL=(await download.json()).url;const signed=new URL(signedURL);assert.equal(signed.origin,new URL(process.env.SUPABASE_URL).origin);const bytes=await(await fetch(signedURL)).arrayBuffer();assert.equal(Buffer.from(bytes).subarray(0,2).toString(),'PK');report.privateZipDownload=true;report.bundleBytes=bytes.byteLength;
 const publicURL=process.env.SUPABASE_URL+'/storage/v1/object/public/adp-downloads/adp-source-bundle.zip';assert.notEqual((await fetch(publicURL)).status,200);report.bucketNotPublic=true;
 const other=await newUser(otherAuth);assert.equal((await(await api('/entitlements',{},other.token)).json()).pro,false);assert.equal((await api('/downloads/source-bundle',{},other.token)).status,403);report.otherUserCannotDownload=true;assert.equal((await api('/resources/agent-research?lang=zh&framework=vue',{},other.token)).status,403);assert.equal((await api('/resources/prompts',{},other.token)).status,403);report.otherUserCannotExportPro=true;
 const duplicate=await api('/checkout',{...options,headers:{...options.headers,'Idempotency-Key':randomUUID()}});assert.equal(duplicate.status,409);report.duplicateLifetimeBlocked=true;
 const invoices=await api('/invoices');assert.equal(invoices.status,200);assert((await invoices.json()).length>=1);report.invoiceAvailable=true;
 const portal=await api('/portal',{method:'POST'});assert.equal(portal.status,200);assert.equal(new URL((await portal.json()).url).hostname,'billing.stripe.com');report.billingPortal=true;
 report.passed=true;
}catch(e){report.passed=false;report.failure=e.code||e.message;}
finally{
 if(checkout?.status==='open'){try{const fresh=await stripe.checkout.sessions.retrieve(checkout.id);if(fresh.status==='open')await stripe.checkout.sessions.expire(checkout.id)}catch{}}
 if(customer){await stripe.customers.del(customer);await store.run('DELETE FROM purchases WHERE customer_id=?',customer);await store.run('DELETE FROM subscriptions WHERE customer_id=?',customer);await store.run('DELETE FROM risks WHERE customer_id=?',customer);await store.run('DELETE FROM customers WHERE customer_id=?',customer)}
 if(user)for(const key of requestKeys)await store.run('DELETE FROM requests WHERE request_key=?',createHash('sha256').update(`${user.id}\0${key}`).digest('hex'));
 await auth.auth.signOut();await otherAuth.auth.signOut();for(const id of users){const r=await admin.auth.admin.deleteUser(id);assert.ifError(r.error)}await store.close();report.testUsersCleanedUp=true;
 await writeFile(new URL('deployed-payment-report.json',folder),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
}
