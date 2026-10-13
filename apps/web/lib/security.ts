import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
const options = {N:32768,r:8,p:3,maxmem:64*1024*1024};
function derive(password: string, salt: string): Promise<Buffer> {return new Promise((resolve,reject)=>scrypt(password,salt,64,options,(err,key)=>err?reject(err):resolve(key)));}
export async function hashPassword(password: string): Promise<string> {
 const salt=randomBytes(16).toString('hex');return ['scrypt',salt,(await derive(password,salt)).toString('hex')].join('$');
}
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
 const [kind,salt,digest]=hash.split('$');if(kind!=='scrypt'||!salt||!digest)return false;
 const expected=Buffer.from(digest,'hex'),actual=await derive(password,salt);return expected.length===actual.length&&timingSafeEqual(expected,actual);
}
export function token(): string {return randomBytes(32).toString('base64url');}
export function tokenHash(value: string): string {return createHash('sha256').update(value).digest('hex');}
