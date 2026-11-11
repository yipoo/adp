// Shared content contract. Only explicitly public fields may cross this boundary.
export const LANGUAGES=['zh','en'];
export const TYPES=['components','blocks','templates'];
const strings=value=>Array.isArray(value)?value.filter(x=>typeof x==='string'):[];
export function itemPath(item,lang='zh'){return `/${lang}/${item.type}/${item.id}/`}
export function categoryPath(id,lang='zh'){return `/${lang}/categories/${id}/`}
export function publicItem(item,{freeExports=false}={}){
  const article={};
  for(const lang of LANGUAGES){const input=item.publicArticle?.[lang]||{};article[lang]={useCases:strings(input.useCases),limitations:strings(input.limitations),integration:strings(input.integration)}}
  return {id:item.id,type:item.type,categoryId:item.categoryId,category:item.category,tier:item.tier,title:item.title,en:item.en,description:item.description,descriptionEn:item.descriptionEn,specs:strings(item.specs),specsEn:strings(item.specsEn),demo:item.demo,background:item.background,publicArticle:article,aliases:strings(item.aliases),...(item.publishedAt?{publishedAt:item.publishedAt}:{}),...(item.updatedAt?{updatedAt:item.updatedAt}:{}),prompt:freeExports&&item.tier==='free'?item.prompt:'',promptEn:freeExports&&item.tier==='free'?item.promptEn:''};
}
export function localizedItem(item,lang){return {title:lang==='zh'?item.title:item.en,description:lang==='zh'?item.description:item.descriptionEn,specs:lang==='zh'?item.specs:item.specsEn,...item.publicArticle[lang]}}
export function validateContent(items,taxonomy){
  const ids=new Set(),categories=new Map(taxonomy.map(x=>[x.id,x]));
  for(const item of items){
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)||ids.has(item.id))throw Error('Invalid or repeated stable item ID: '+item.id);ids.add(item.id);
    if(!TYPES.includes(item.type)||!['free','pro'].includes(item.tier)||!categories.has(item.categoryId))throw Error('Invalid content classification: '+item.id);
    for(const lang of LANGUAGES){const c=localizedItem(publicItem(item),lang);if(!c.title||!c.description||c.specs.length<3||!c.useCases.length||!c.limitations.length||!c.integration.length)throw Error('Incomplete public article: '+item.id+'/'+lang)}
    for(const date of ['publishedAt','updatedAt'])if(item[date]&&!/^\d{4}-\d{2}-\d{2}$/.test(item[date]))throw Error('Use explicit editorial dates: '+item.id);
    for(const alias of item.aliases||[])if(!/^\/(?:zh|en)\/[a-z0-9/-]+\/$/.test(alias))throw Error('Invalid historical alias: '+item.id);
  }
}
