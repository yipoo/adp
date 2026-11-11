import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {publicItem,validateContent} from '../src/content.js';
const root=process.env.SITE_OUTPUT||'dist';
const source=JSON.parse(fs.readFileSync('data/catalog.json'));
const taxonomy=JSON.parse(fs.readFileSync('data/taxonomy.json'));
validateContent(source,taxonomy);
const manifest=JSON.parse(fs.readFileSync(root+'/data/routes.json'));
const identities=JSON.parse(fs.readFileSync('data/identities.json'));
for(const identity of identities){const item=source.find(x=>x.id===identity.id);assert(item,'Immutable ID removed: '+identity.id);if(item.type!==identity.type)for(const lang of ['zh','en'])assert(item.aliases.includes(`/${lang}/${identity.type}/${identity.id}/`),'Missing route migration');}
assert.equal(source.length,identities.length);
const indexable=manifest.pages;
for(const alias of manifest.aliases){assert(!indexable.some(x=>x.path===alias.from),'Alias shadows a canonical page');assert(indexable.some(x=>x.path===alias.to),'Alias target does not exist');}
assert.equal(new Set(manifest.aliases.map(x=>x.from)).size,manifest.aliases.length);
assert.equal(indexable.filter(x=>x.type==='item').length,source.length*2);
assert.equal(new Set(indexable.map(x=>x.path)).size,indexable.length);
const sitemap=fs.readFileSync(root+'/sitemap.xml','utf8');
for(const route of indexable){
  const html=fs.readFileSync(root+route.path+'index.html','utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route.path+' h1');
  assert(html.includes('<link rel="canonical" href="https://adp.yipoo.com'+route.path+'">'));
  assert(html.includes('hreflang="zh-Hans"'));assert(html.includes('hreflang="en"'));
  if(route.path==='/zh/'||route.path==='/en/'){assert(html.includes('id="search"'));assert(html.includes('id="grid"'));assert(html.includes('/src/app.js'));assert.equal((html.match(/class="card templates"/g)||[]).length,5);assert(html.includes('aria-label="'+(route.lang==='zh'?'分类':'Category')+'"'));}
  assert(html.includes('<meta name="description"'));assert(html.includes('application/ld+json'));
  assert(sitemap.includes('<loc>https://adp.yipoo.com'+route.path+'</loc>'));
  assert(!html.includes('undefined'));
  const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];for(const script of scripts)JSON.parse(script[1]);
  for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
    const target=match[1];if(target.startsWith('/api/'))continue;
    assert(fs.existsSync(path.join(root,target,target.endsWith('/')?'index.html':'')),route.path+' broken link: '+target);
  }
  if(route.type==='item'){
    const item=source.find(x=>x.id===route.id),language=route.lang==='zh'?'zh':'en';
    const body=html.replace(/<script[\s\S]*?<\/script>/g,'');
    assert(body.includes(item.publicArticle[language].useCases[0]));assert(body.includes(item.publicArticle[language].limitations[0]));
    assert(body.includes('id="behavior"'));assert(body.includes('id="integration"'));
    if(item.tier==='pro'){assert(!html.includes(item.prompt));assert(!html.includes(item.promptEn));assert(!html.includes('id="public-prompt"'));assert(!fs.existsSync(root+'/sources/'+item.id));}
    if(!item.updatedAt)assert(!html.includes('dateModified'),'No fabricated update dates');
    assert(html.includes('\"isAccessibleForFree\":'+String(item.tier==='free')));
  }
}
const catalog=JSON.parse(fs.readFileSync(root+'/data/catalog.json'));
for(const item of source){const row=catalog.find(x=>x.id===item.id);assert.deepEqual(row,publicItem(item,{freeExports:true}));if(item.tier==='pro'){assert.equal(row.prompt,'');assert.equal(row.promptEn,'')}}
const search=JSON.parse(fs.readFileSync(root+'/data/search.json'));
assert.equal(search.length,source.length*2);assert(search.every(x=>!('prompt' in x)&&!('promptEn' in x)));
assert(fs.readFileSync(root+'/studio/index.html','utf8').includes('content="noindex,follow"'));
assert(fs.readFileSync(root+'/404.html','utf8').includes('noindex,follow'));
assert(fs.existsSync(root+'/src/account.js'));assert(fs.existsSync(root+'/src/auth-client.js'));
assert(!sitemap.includes('/studio/'));assert(!sitemap.includes('/preview.html'));assert(!sitemap.includes('/account.html'));
assert(fs.readFileSync(root+'/src/legacy.js','utf8').includes('#item='));
console.log(`PASS: ${indexable.length} indexable routes, ${source.length*2} no-JS item articles, canonical/language pairs, JSON-LD, sitemap, links, public allowlist and Pro boundaries.`);
