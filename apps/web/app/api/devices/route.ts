import { endpoint,json } from '../../../lib/http.ts';
import { authenticated } from '../../../lib/auth.ts';
import { db } from '../../../lib/db.ts';
export const GET=endpoint(async r=>{const a=await authenticated(r);return json({items:await db().device.findMany({where:{userId:a.userId},select:{id:true,name:true,revokedAt:true},take:100,orderBy:{id:'asc'}})});});
