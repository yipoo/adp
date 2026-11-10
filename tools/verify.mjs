import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {demoDocument,demoParts} from '../src/demos.js';
const items=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
assert.equal(new Set(items.map(x=>x.id)).size,items.length);
for(const type of ['components','blocks','templates'])for(const tier of ['free','pro'])assert(items.some(x=>x.type===type&&x.tier===tier),`${type}/${tier} missing`);
for(const item of items){assert(item.promptEn.length>500);assert(!/[\u4e00-\u9fff]/.test(demoParts(item,{lang:'en'}).html),'Untranslated English preview: '+item.id);assert(item.prompt.length>500);assert(item.specs.length>=3);const html=demoDocument(item);assert(html.includes('</script>'));assert(!html.includes('undefined'));assert(html.includes('prefers-reduced-motion'));const source=html.match(/<script>([\s\S]*)<\/script>/)?.[1];assert(source,'preview script missing');new Function(source);}
console.log(`Verified ${items.length} catalog entries, 3 types, Free/Pro coverage, prompt completeness and preview script syntax.`);
