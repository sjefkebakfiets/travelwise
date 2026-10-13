import { initializeAdmin } from '../lib/auth.ts';
import { db } from '../lib/db.ts';
if(!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD)throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in process environment');
try{await initializeAdmin(process.env.ADMIN_EMAIL,process.env.ADMIN_PASSWORD);console.log('Administrator initialized');}finally{await db().$disconnect();delete process.env.ADMIN_PASSWORD;}
