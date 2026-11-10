import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transformSync} from 'esbuild';
import {parse,compileScript,compileTemplate,compileStyle} from '@vue/compiler-sfc';
import {demoDocument} from '../src/demos.js';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url)));
let checked=0;
for(const item of catalog)for(const lang of ['en','zh']){
assert(item.descriptionEn);assert(item.specsEn?.length>=3);assert(item.promptEn.length>500);
const base=new URL(`../sources/${item.id}/${lang}/`,import.meta.url);const name=item.id.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join('');
const react=await readFile(new URL(name+'.jsx',base),'utf8');transformSync(react,{loader:'jsx',jsx:'automatic'});assert(react.startsWith('"use client"'));assert(!react.includes('dangerouslySetInnerHTML'));assert(react.includes('useEffect'));checked++;
const vue=await readFile(new URL(name+'.vue',base),'utf8');const parsed=parse(vue,{filename:name+'.vue'});assert.deepEqual(parsed.errors,[]);compileScript(parsed.descriptor,{id:item.id});const template=compileTemplate({source:parsed.descriptor.template.content,filename:name+'.vue',id:item.id});assert.deepEqual(template.errors,[]);for(const style of parsed.descriptor.styles)assert.deepEqual(compileStyle({source:style.content,filename:name+'.vue',id:item.id}).errors,[]);checked++;
const html=await readFile(new URL('index.html',base),'utf8');assert(html.includes('</script>'));const script=html.match(/<script>([\s\S]*)<\/script>/)[1];new Function(script);assert.equal(html,demoDocument(item,{lang}));checked++;
}
console.log(`Compiled ${checked} source files: React JSX, Vue script/template/styles, HTML scripts; both languages; ${catalog.length} designs.`);
