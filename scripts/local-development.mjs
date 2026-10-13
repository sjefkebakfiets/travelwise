import {spawn} from 'node:child_process';
import {localPostgres,run,root} from './local-postgres.mjs';
const cluster=localPostgres('development');
try {
 const env={...cluster.env,DATABASE_URL:cluster.createDatabase('travelwise_local')};
 run(['node_modules/prisma/build/index.js','generate','--config','apps/web/prisma.config.ts'],env);
 run(['node_modules/prisma/build/index.js','migrate','deploy','--config','apps/web/prisma.config.ts'],env);
 console.log('Travelwise lokaal: http://127.0.0.1:3006. Stop met Ctrl+C.');
 const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','apps/web','--webpack','--hostname','127.0.0.1','--port','3006'],{cwd:root,env,stdio:'inherit',windowsHide:true});
 const stop=()=>child.kill('SIGTERM');process.on('SIGINT',stop);process.on('SIGTERM',stop);
 await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});process.off('SIGINT',stop);process.off('SIGTERM',stop);
} finally {cluster.stop();}
