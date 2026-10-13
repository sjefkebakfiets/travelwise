import { endpoint } from '../../../../../lib/http.ts';
import { gpsPage } from '../../../../../lib/gps-api.ts';
export const runtime='nodejs';
export async function GET(r:Request,c:{params:Promise<{id:string}>}){const {id}=await c.params;return endpoint(req=>gpsPage(req,id))(r);}
