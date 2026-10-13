import { db } from '../../../lib/db.ts';
import { json } from '../../../lib/http.ts';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(){try{await db().user.findFirst({select:{id:true}});return json({status:'ok',database:'ok'});}catch{return json({status:'unavailable',database:'unavailable'},503);}}
