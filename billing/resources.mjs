import {readFile} from 'node:fs/promises';
import catalog from '../data/catalog.json' with {type:'json'};
const fail=(message,status)=>{throw Object.assign(Error(message),{status})};
const componentName=id=>id.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join('');
export async function loadResource(id,lang,framework){const item=catalog.find(x=>x.id===id);if(!item)fail('Design not found',404);if(!['en','zh'].includes(lang)||!['react','vue','html','prompt'].includes(framework))fail('Invalid resource selection',400);const prompt=lang==='zh'?item.prompt:item.promptEn;if(framework==='prompt')return{id,lang,prompt};const filename=framework==='html'?'index.html':componentName(id)+(framework==='vue'?'.vue':'.jsx');const code=await readFile(new URL('./resources/'+id+'/'+lang+'/'+filename,import.meta.url),'utf8');return{id,lang,prompt,code,filename}}
export function loadPromptCatalog(){return catalog.flatMap(item=>['en','zh'].map(lang=>({id:item.id,title:lang==='en'?item.en:item.title,type:item.type,tier:item.tier,lang,prompt:lang==='en'?item.promptEn:item.prompt})))}
