import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {randomBytes,randomUUID} from 'node:crypto';
const suffix=randomBytes(8).toString('hex'),network='travelwise-ci-'+suffix,database='travelwise_test_'+suffix,dbName='travelwise-db-'+suffix,appName='travelwise-app-'+suffix,appImage='travelwise-app-test:'+suffix,migrationImage='travelwise-migrations-test:'+suffix;
const password=randomBytes(32).toString('hex'),adminPassword=randomBytes(32).toString('hex');const env={...process.env,POSTGRES_PASSWORD:password,DATABASE_URL:'postgresql://travelwise_test:'+password+'@'+dbName+':5432/'+database,ADMIN_EMAIL:'docker-'+suffix+'@example.test',ADMIN_PASSWORD:adminPassword,AUTH_SECRET:randomBytes(32).toString('hex')};
const containers=[];let networkCreated=false;
function docker(args,inherit=false){return execFileSync('docker',args,{env,stdio:inherit?'inherit':'pipe',encoding:'utf8'});}
async function ready(base){for(let i=0;i<120;i++){try{if((await fetch(base+'/api/ready',{signal:AbortSignal.timeout(1000)})).ok)return;}catch{}await new Promise(r=>setTimeout(r,500));}throw Error('Container did not become ready');}
try {
 docker(['build','-f','infrastructure/docker/Dockerfile','-t',appImage,'.'],true);
 docker(['build','--target','migrations','-f','infrastructure/docker/Dockerfile','-t',migrationImage,'.'],true);
 docker(['network','create',network]);networkCreated=true;
 docker(['run','--detach','--rm','--network',network,'--name',dbName,'-e','POSTGRES_PASSWORD','-e','POSTGRES_USER=travelwise_test','-e','POSTGRES_DB='+database,'postgres:17-alpine']);containers.push(dbName);
 let databaseReady=false;for(let i=0;i<120;i++){if(spawnSync('docker',['exec',dbName,'pg_isready','-U','travelwise_test','-d',database],{stdio:'ignore'}).status===0){databaseReady=true;break;}await new Promise(r=>setTimeout(r,500));}if(!databaseReady)throw Error('Database container did not become ready');
 docker(['run','--rm','--network',network,'-e','DATABASE_URL',migrationImage],true);
 docker(['run','--rm','--network',network,'-e','DATABASE_URL','-e','ADMIN_EMAIL','-e','ADMIN_PASSWORD',migrationImage,'node','apps/web/scripts/init-admin.ts'],true);
 docker(['run','--detach','--rm','--network',network,'--name',appName,'-e','DATABASE_URL','-e','AUTH_SECRET','-p','127.0.0.1::3000',appImage]);containers.push(appName);
 function publishedURL(){const address=docker(['port',appName,'3000/tcp']).trim();if(!/^127\.0\.0\.1:\d+$/.test(address))throw Error('Invalid published test address');return 'http://'+address;}let base=publishedURL();await ready(base);
 async function call(path,method='GET',body,token){const r=await fetch(base+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()};}
 const home=await fetch(base);assert.equal(home.status,200);const html=await home.text();const css=html.match(/href="([^"]+\.css[^"]*)"/);assert.ok(css);assert.equal((await fetch(base+css[1])).status,200);
 assert.equal((await call('/api/trips')).status,401);const login=await call('/api/auth/mobile/login','POST',{email:env.ADMIN_EMAIL,password:adminPassword,deviceName:'Docker test'});assert.equal(login.status,200);const token=login.data.accessToken;const trip=await call('/api/trips','POST',{title:'Docker persistence test'},token);assert.equal(trip.status,201);const batch={tripId:trip.data.id,points:[{id:randomUUID(),segmentId:randomUUID(),latitude:52,longitude:5,timestamp:'2026-10-13T12:00:00Z',accuracy:5}]};assert.equal((await call('/api/gps/batch','POST',batch,token)).status,200);assert.equal((await call('/api/gps/batch','POST',batch,token)).status,200);
 docker(['restart',appName]);base=publishedURL();await ready(base);assert.equal((await call('/api/trips/'+trip.data.id+'/gps','GET',undefined,token)).data.items.length,1);
 docker(['restart',dbName]);await ready(base);assert.equal((await call('/api/trips/'+trip.data.id+'/gps','GET',undefined,token)).data.items.length,1);
 console.log('Docker migration, bootstrap, HTTP API, static assets and restart persistence passed');
 } catch(error) {for(const name of containers){try{console.error('Test container: '+name+' state='+docker(['inspect','--format','{{.State.Status}}',name]).trim());const result=spawnSync('docker',['logs','--tail','60',name],{env,encoding:'utf8'});const logs=(result.stdout??'')+(result.stderr??'');console.error(logs.replaceAll(password,'[password]').replaceAll(adminPassword,'[password]'));}catch{}}throw error;} finally {for(const name of containers.reverse()){try{docker(['stop',name]);}catch{}}if(networkCreated){try{docker(['network','rm',network]);}catch{}}}
