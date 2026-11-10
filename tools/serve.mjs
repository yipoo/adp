import http from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const allowed=new Set(['src','data','sources','assets','qa-runtime']);
const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const parts=pathname.split('/').filter(Boolean);if(parts.some(p=>p.startsWith('.')||p==='..')||(parts.length>1&&!allowed.has(parts[0]))||(parts.length===1&&!['index.html','preview.html','account.html'].includes(parts[0]))){res.writeHead(404);return res.end('Not found');}const file=['/src/account.js','/src/auth-client.js'].includes(pathname)?path.join(root,'.vercel/output/static'+pathname):path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));const actual=await realpath(file);if(!actual.startsWith(root+path.sep)||actual.split(path.sep).includes('billing')||actual.split(path.sep).includes('node_modules')){res.writeHead(404);return res.end('Not found');}const body=await readFile(actual);res.writeHead(200,{'Content-Type':(types[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-cache'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(Number(process.env.PORT??4180),'127.0.0.1',()=>console.log('ADP → http://127.0.0.1:'+server.address().port));
