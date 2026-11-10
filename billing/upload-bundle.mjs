import {readFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
if(process.env.SUPABASE_URL!=='https://ozzutjxoxdoqvxsfemmn.supabase.co')throw Error('Selected development project required');
const client=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const bucket=process.env.PRIVATE_PACK_BUCKET||'adp-downloads';const {data:existing,error:lookupError}=await client.storage.getBucket(bucket);
if(!existing){if(lookupError&&!/not found/i.test(lookupError.message))throw Error('Bucket lookup failed');const {error}=await client.storage.createBucket(bucket,{public:false,fileSizeLimit:10485760,allowedMimeTypes:['application/zip']});if(error)throw Error('Private bucket creation failed')}
if(existing?.public)throw Error('ADP storage must be private');
const bytes=await readFile(new URL('../private/adp-source-bundle.zip',import.meta.url));const {error}=await client.storage.from(bucket).upload('adp-source-bundle.zip',bytes,{upsert:true,contentType:'application/zip'});if(error)throw Error('Bundle upload failed');
console.log(JSON.stringify({bucket,private:true,bundleUploaded:true,bytes:bytes.length}));
