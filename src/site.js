const stage=document.querySelector('[data-demo-id]');
if(stage){const button=document.querySelector('[data-load-demo]');let item;
  async function start(){button.disabled=true;try{const {demoDocument}=await import('./demos.js');item??=(await (await fetch('/data/catalog.json')).json()).find(x=>x.id===stage.dataset.demoId);if(!item)throw Error();const frame=document.createElement('iframe');frame.title=stage.dataset.demoTitle;frame.setAttribute('sandbox','allow-scripts allow-forms allow-downloads');frame.srcdoc=demoDocument(item,{lang:document.documentElement.lang.startsWith('zh')?'zh':'en'});stage.replaceChildren(frame);button.textContent=button.dataset.reset;button.disabled=false;}catch{button.disabled=false;const error=document.createElement('p');error.className='load-error';error.textContent=document.documentElement.lang.startsWith('zh')?'演示暂时无法加载，请重试。':'The demo could not load. Please try again.';stage.append(error)}}
  button.addEventListener('click',start);
}
const search=document.querySelector('[data-public-search]');
if(search)search.addEventListener('input',()=>{const q=search.value.trim().toLocaleLowerCase();let count=0;document.querySelectorAll('[data-search-text]').forEach(card=>{card.hidden=!card.dataset.searchText.toLocaleLowerCase().includes(q);if(!card.hidden)count++});document.querySelector('[data-search-count]').textContent=count;document.querySelector('[data-search-empty]').hidden=count>0});
const copyButton=document.querySelector('[data-copy-prompt]');
if(copyButton){let restore;
  copyButton.addEventListener('click',async()=>{try{
    await navigator.clipboard.writeText(document.querySelector('#public-prompt').textContent);
    clearTimeout(restore);copyButton.textContent=copyButton.dataset.copied;document.querySelector('[data-copy-status]').textContent=copyButton.dataset.copied;
    restore=setTimeout(()=>{copyButton.textContent=copyButton.dataset.label;document.querySelector('[data-copy-status]').textContent=''},1800);
  }catch{clearTimeout(restore);copyButton.textContent=copyButton.dataset.label;document.querySelector('[data-copy-status]').textContent=copyButton.dataset.error}});
}
