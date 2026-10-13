import { db } from '../../../lib/db.ts';
import { json } from '../../../lib/http.ts';
export const dynamic='force-dynamic';
export const runtime='nodejs';
let lastError='';
export async function GET(){try{await db().user.findFirst({select:{id:true}});lastError='';return json({status:'ok',database:'ok'});}catch(error){let message=error instanceof Error?error.message:'Unknown database error';const url=process.env.DATABASE_URL;if(url){message=message.replaceAll(url,'[database URL]');try{const password=new URL(url).password;if(password)message=message.replaceAll(password,'[password]');}catch{}}if(message!==lastError){console.error(JSON.stringify({event:'database_readiness_failed',message}));lastError=message;}return json({status:'unavailable',database:'unavailable'},503);}}
