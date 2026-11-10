import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||pathname.includes('/.')){res.writeHead(403);return res.end();}const body=await readFile(file);res.writeHead(200,{'Content-Type':(types[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-cache'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(Number(process.env.PORT)||4180,'127.0.0.1',()=>console.log('UI-Prompt → http://127.0.0.1:'+server.address().port));
