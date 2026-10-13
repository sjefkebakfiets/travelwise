import { endpoint } from '../../../../lib/http.ts';
import { getTrip,editTrip,deleteTrip } from '../../../../lib/trips.ts';
type Context={params:Promise<{id:string}>};
export const runtime='nodejs';
export async function GET(r:Request,c:Context){const {id}=await c.params;return endpoint(req=>getTrip(req,id))(r);}
export async function PATCH(r:Request,c:Context){const {id}=await c.params;return endpoint(req=>editTrip(req,id))(r);}
export async function DELETE(r:Request,c:Context){const {id}=await c.params;return endpoint(req=>deleteTrip(req,id))(r);}
