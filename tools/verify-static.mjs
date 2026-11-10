import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
const root=new URL('../.vercel/output/static/',import.meta.url);let count=0;
async function walk(dir){for(const file of await readdir(dir,{withFileTypes:true})){assert(!file.name.startsWith('.'));assert(!['billing','node_modules','private'].includes(file.name));const url=new URL(file.name+(file.isDirectory()?'/':''),dir);if(file.isDirectory())await walk(url);else{count++;const text=await readFile(url,'utf8');assert(!/\b(?:sk_test_|sk_live_|rk_test_|rk_live_|whsec_|sb_secret_)[A-Za-z0-9_]{12,}/.test(text),'A server credential was found in static output')}}}
await walk(root);const account=await readFile(new URL('account.html',root),'utf8');assert(account.includes('./src/account.js'));const frontend=await readFile(new URL('src/account.js',root),'utf8');assert(frontend.includes('adp-lifetime'));assert(!frontend.includes('adp-pro-monthly'));assert(!frontend.includes('adp-pro-yearly'));console.log(`Verified ${count} public files: no server code, private bundle, hidden files, or credentials.`);
const catalog=JSON.parse(await readFile(new URL('data/catalog.json',root),'utf8'));
for(const item of catalog){if(item.tier==='pro'){assert.equal(item.prompt,'');assert.equal(item.promptEn,'');try{await readdir(new URL('sources/'+item.id+'/',root));assert.fail('Pro source must not be publicly deployed')}catch(e){assert.equal(e.code,'ENOENT')}}else assert(item.prompt.length>500)}
console.log('Free exports remain public; every Pro prompt and framework source is excluded from static output.');
