import {execFileSync,spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
const suffix=randomBytes(8).toString('hex'),name='travelwise-test-'+suffix,database='travelwise_test_'+suffix,password=randomBytes(32).toString('hex');
const env={...process.env,POSTGRES_PASSWORD:password,TRAVELWISE_INTEGRATION:'1'};
let started=false;
try {
 execFileSync('docker',['run','--detach','--rm','--name',name,'-e','POSTGRES_PASSWORD','-e','POSTGRES_USER=travelwise_test','-e','POSTGRES_DB='+database,'-p','127.0.0.1::5432','postgres:17-alpine'],{env,stdio:'pipe'});started=true;
 let ready=false;for(let i=0;i<120;i++){const r=spawnSync('docker',['exec',name,'pg_isready','-U','travelwise_test','-d',database],{stdio:'ignore'});if(r.status===0){ready=true;break;}await new Promise(resolve=>setTimeout(resolve,500));}if(!ready)throw Error('Test PostgreSQL did not become ready');
 const port=execFileSync('docker',['port',name,'5432/tcp'],{encoding:'utf8'}).trim().split(':').at(-1);
 env.DATABASE_URL='postgresql://travelwise_test:'+password+'@127.0.0.1:'+port+'/'+database;
 for(const args of [['node_modules/prisma/build/index.js','migrate','deploy','--config','apps/web/prisma.config.ts'],['--test','apps/web/tests/integration.test.ts']]){const r=spawnSync(process.execPath,args,{env,stdio:'inherit'});if(r.status!==0)throw Error('Database check failed');}
} finally {if(started)execFileSync('docker',['stop',name],{stdio:'ignore'});}
