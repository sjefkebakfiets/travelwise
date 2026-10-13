import { ZodError } from 'zod';
import { randomUUID } from 'node:crypto';
import { db } from './db.ts';
import { tokenHash } from './security.ts';
export class ApiError extends Error {status:number;code:string;constructor(status:number,code:string,message:string){super(message);this.status=status;this.code=code;}}
export function json(value: unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store'}});}
export function endpoint(fn: (request: Request)=>Promise<Response>) {return async(request: Request)=>{try{return await fn(request);}catch(error){if(error instanceof ApiError)return json({error:{code:error.code,message:error.message}},error.status);if(error instanceof ZodError)return json({error:{code:'VALIDATION_ERROR',message:'Invalid request fields',fields:error.issues.map(i=>i.path.join('.'))}},400);const id=randomUUID();console.error(JSON.stringify({event:'api_error',id,type:error instanceof Error?error.name:'unknown'}));return json({error:{code:'INTERNAL_ERROR',message:'Request failed',requestId:id}},500);}};}
export async function body(request: Request, max=262144): Promise<unknown> {
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new ApiError(415,'JSON_REQUIRED','Use application/json');
 if(Number(request.headers.get('content-length')??0)>max)throw new ApiError(413,'PAYLOAD_TOO_LARGE','Request body too large');
 const reader=request.body?.getReader();if(!reader)throw new ApiError(400,'INVALID_JSON','Missing body');
 const chunks:Uint8Array[]=[];let size=0;try{while(true){const next=await reader.read();if(next.done)break;size+=next.value.length;if(size>max){await reader.cancel();throw new ApiError(413,'PAYLOAD_TOO_LARGE','Request body too large');}chunks.push(next.value);}}finally{reader.releaseLock();}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new ApiError(400,'INVALID_JSON','Malformed JSON');}
}
export async function rateLimit(scope: string, max: number, seconds=60){const window=Math.floor(Date.now()/(seconds*1000));const key=tokenHash(scope)+':'+window;const row=await db().rateLimit.upsert({where:{key},create:{key,count:1,expiresAt:new Date((window+1)*seconds*1000)},update:{count:{increment:1}}});if(row.count===1)await db().rateLimit.deleteMany({where:{expiresAt:{lt:new Date(Date.now()-86400000)}}});if(row.count>max)throw new ApiError(429,'RATE_LIMITED','Try again later');}
export function uuid(value: string){if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))throw new ApiError(400,'INVALID_ID','Invalid identifier');return value.toLowerCase();}
