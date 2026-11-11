import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import postcss from 'postcss';
import {demoParts,demoDocument} from '../src/demos.js';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url)));
const temporary=new URL('../.oil-ui/source-check/source-input.json',import.meta.url);
const inputs=[];
for(const item of catalog)for(const lang of ['en','zh']){
const p=demoParts(item,{lang});
// Scope every selector, including selectors inside media blocks, to this component.
const css=postcss.parse(p.css);
css.walkRules(rule=>{if(rule.parent.type==='atrule'&&/keyframes$/.test(rule.parent.name))return;rule.selector=rule.selectors.map(s=>{if(s==='body')return '.adp-demo';return '.adp-demo '+s.replace(/\bbody\b/g,'.adp-demo')}).join(',')});
// Match real page layout without imposing a viewport on reusable small components.
const scope='adp-'+item.id;
const scoped=css.toString().replaceAll('.adp-demo','.'+scope)+`\n.${scope}{min-height:${item.type==='templates'?'780px':'340px'};width:100%;box-sizing:border-box}.${scope} [hidden]{display:none!important}`;
const runtime=`function mountDemo(root) {\n  const cleanups = [];\n  const timers = new Set();\n  const intervals = new Set();\n  const document = {\n    querySelector: (s) => root.querySelector(s),\n    querySelectorAll: (s) => root.querySelectorAll(s),\n    createElement: (tag) => window.document.createElement(tag),\n    addEventListener: (name, handler) => { root.addEventListener(name, handler); cleanups.push(() => root.removeEventListener(name, handler)); },\n  };\n  const setTimeout = (fn, ms) => { const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };\n  const setInterval = (fn, ms) => { const id = window.setInterval(fn, ms); intervals.add(id); return id; };\n  const clearInterval = (id) => { window.clearInterval(id); intervals.delete(id); };\n  ${p.script.trim()}\n  return () => { timers.forEach(window.clearTimeout); intervals.forEach(window.clearInterval); cleanups.forEach(fn => fn()); };\n}`;
const name=item.id.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join('');
const dir=new URL(`../sources/${item.id}/${lang}/`,import.meta.url);await mkdir(dir,{recursive:true});
await writeFile(new URL('index.html',dir),demoDocument(item,{lang}));
await writeFile(new URL(`${name}.vue`,dir),`<!-- ADP / ${item.en}. Vue 3. No external UI dependencies.\n     AI responses and workflow runs are local interactions; connect your own services.\n     Listen for adp-navigate on the root to integrate your application router. -->\n<script setup>\nimport { ref, onMounted, onBeforeUnmount } from 'vue';\nconst root = ref(null);\nlet cleanup;\nonMounted(() => { cleanup = mountDemo(root.value); });\nonBeforeUnmount(() => cleanup?.());\n${runtime}\n</script>\n\n<template>\n  <div ref="root" class="${scope}">${p.html}</div>\n</template>\n\n<style>\n${scoped}\n</style>\n`);
inputs.push({id:item.id,lang,name,html:p.html,css:scoped,runtime,scope});
}
await writeFile(temporary,JSON.stringify(inputs));
const converted=spawnSync('python3',[new URL('jsx-convert.py',import.meta.url).pathname,temporary.pathname],{encoding:'utf8'});
if(converted.status!==0)throw Error(converted.stderr);
console.log(`Generated ${inputs.length*3} self-contained source files across HTML, Vue 3, and Next.js / React.`);
