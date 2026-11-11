// Preserve old links while keeping public item URLs canonical.
const params=new URLSearchParams(location.search),root=document.body.hasAttribute('data-root-bridge');
const pathLang=location.pathname.match(/^\/(zh|en)\//)?.[1];
const lang=pathLang||(params.get('lang')==='en'?'en':params.get('lang')?.startsWith('zh')?'zh':document.documentElement.lang.startsWith('en')?'en':'zh');
let id=params.get('item');try{if(location.hash.startsWith('#item='))id=decodeURIComponent(location.hash.slice(6))}catch{/* Invalid fragments retain the fallback links. */}
if(id){try{const routes=await(await fetch('/data/routes.json')).json();const path=routes.items[id]?.[lang];if(path)location.replace(path);else location.replace('/404.html')}catch{/* The document still has usable navigation without the bridge. */}}
else if(root){const work=location.hash&&location.hash!=='#';location.replace(work?'/studio/'+location.search+location.hash:`/${lang}/`)}
