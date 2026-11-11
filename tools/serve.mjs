import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.env.SERVE_ROOT||'dist');
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.txt':'text/plain','.vue':'text/plain','.jsx':'text/plain','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname),parts=pathname.split('/').filter(Boolean);
 if(parts.some(x=>x.startsWith('.')||x==='..')||parts.some(x=>['billing','node_modules','private'].includes(x)))throw Error('Not found');
 let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root)throw Error('Not found');
 const stat=await fs.stat(file);if(stat.isDirectory()){if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'+url.search});res.end();return}file=path.join(file,'index.html')}
 const actual=await fs.realpath(file);if(!actual.startsWith(root+path.sep))throw Error('Not found');
 const body=await fs.readFile(actual);res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-cache','X-Robots-Tag':'noindex, follow'});res.end(body);
}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, follow'});res.end(await fs.readFile(path.join(root,'404.html')).catch(()=>Buffer.from('Not found')))}});
server.listen(Number(process.env.PORT??4180),'127.0.0.1',()=>console.log('ADP → http://127.0.0.1:'+server.address().port));
