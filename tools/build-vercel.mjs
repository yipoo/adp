import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {build} from 'esbuild';
execFileSync(process.execPath,['tools/build-site.mjs'],{stdio:'inherit'});
const output='.vercel/output';fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output+'/static',{recursive:true});
fs.cpSync('dist',output+'/static',{recursive:true});
const fn=output+'/functions/api/billing.func';fs.mkdirSync(fn,{recursive:true});fs.cpSync('billing/certs',fn+'/certs',{recursive:true});fs.cpSync('sources',fn+'/resources',{recursive:true});
await build({entryPoints:['billing/vercel.mjs'],outfile:fn+'/index.mjs',bundle:true,format:'esm',platform:'node',target:'node24',banner:{js:"import {createRequire as _createRequire} from 'node:module';const require=_createRequire(import.meta.url);"},external:['pg-native']});
fs.writeFileSync(fn+'/.vc-config.json',JSON.stringify({runtime:'nodejs24.x',handler:'index.mjs',launcherType:'Nodejs',maxDuration:60}));
const manifest=JSON.parse(fs.readFileSync('dist/data/routes.json','utf8'));
fs.writeFileSync(output+'/config.json',JSON.stringify({version:3,regions:['sin1'],routes:[...(process.env.VERCEL_ENV==='preview'||process.env.SEO_NOINDEX==='true'?[{src:'/(.*)',headers:{'X-Robots-Tag':'noindex, nofollow'},continue:true}]:[]),{src:'/(?:studio(?:/.*)?|preview[.]html|account[.]html|sources/.*)',headers:{'X-Robots-Tag':'noindex, follow'},continue:true},...manifest.aliases.map(x=>({src:x.from,status:308,headers:{Location:x.to}})),{src:'/api/billing(?:/(.*))?',dest:'/api/billing?__route=$1'},{handle:'filesystem'},{src:'/',dest:'/index.html'},{src:'/(.*)',status:404,dest:'/404.html'}]}));
console.log('Built ADP static site, bundled account client, and isolated Node billing function.');

execFileSync(process.execPath,['tools/verify-branding.mjs'],{stdio:'inherit'});

execFileSync(process.execPath,['tools/verify-seo.mjs'],{stdio:'inherit'});
