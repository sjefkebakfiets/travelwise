import { endpoint,json,uuid } from '../../../../lib/http.ts';
import { authenticated,revokeDevice } from '../../../../lib/auth.ts';
export async function DELETE(r:Request,c:{params:Promise<{id:string}>}){const {id}=await c.params;return endpoint(async req=>{const a=await authenticated(req);await revokeDevice(a.userId,uuid(id));return json({revoked:true});})(r);}
