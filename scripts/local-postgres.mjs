import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function run(args,env){const result=spawnSync(process.execPath,args,{cwd:root,env,stdio:'inherit',windowsHide:true});if(result.status!==0)throw Error('Command failed: '+args[0]);}
export function localPostgres(kind){
 if(process.platform!=='win32')throw Error('This portable PostgreSQL launcher supports Windows');
 if(!['development','test'].includes(kind))throw Error('Invalid cluster kind');
 const bin=path.join(root,'.tools','pgsql','bin'),dir=path.join(root,'.local',kind),data=path.join(dir,'postgres'),secret=path.join(dir,'database.json');
 if(!fs.existsSync(path.join(bin,'initdb.exe')))throw Error('Portable PostgreSQL missing. See docs/local-windows.md');
 fs.mkdirSync(dir,{recursive:true});
 if(!fs.existsSync(secret)){if(fs.existsSync(path.join(data,'PG_VERSION')))throw Error('Existing cluster has no local configuration; refusing to change it');fs.writeFileSync(secret,JSON.stringify({password:randomBytes(32).toString('hex'),port:kind==='test'?54328:54327,user:'travelwise_local'}));}
 const config=JSON.parse(fs.readFileSync(secret,'utf8'));const env={...process.env,PGPASSWORD:config.password};
 function pg(command,args,quiet=false){const result=spawnSync(path.join(bin,command+'.exe'),args,{cwd:root,env,stdio:quiet?'pipe':'inherit',windowsHide:true});if(result.status!==0)throw Error('PostgreSQL command failed: '+command);return result;}
 if(!fs.existsSync(path.join(data,'PG_VERSION'))){const pwfile=path.join(dir,'initial-password.txt');fs.writeFileSync(pwfile,config.password+'\n');pg('initdb',['-D',data,'-U',config.user,'--encoding=UTF8','--locale=C','--auth=scram-sha-256','--pwfile='+pwfile]);fs.writeFileSync(pwfile,'');}
 const status=spawnSync(path.join(bin,'pg_ctl.exe'),['-D',data,'status'],{cwd:root,env,stdio:'ignore',windowsHide:true});const started=status.status!==0;
 if(started)pg('pg_ctl',['-D',data,'-l',path.join(dir,'postgres.log'),'-o','-p '+config.port+' -h 127.0.0.1','-w','start']);
 return {env,createDatabase(name){if(!/^travelwise_(local|test_[a-f0-9]+)$/.test(name))throw Error('Invalid database name');const exists=pg('psql',['-h','127.0.0.1','-p',String(config.port),'-U',config.user,'-d','postgres','-tAc',"SELECT 1 FROM pg_database WHERE datname='"+name+"'"],true);if(!exists.stdout.toString().trim())pg('createdb',['-h','127.0.0.1','-p',String(config.port),'-U',config.user,name]);return 'postgresql://'+config.user+':'+config.password+'@127.0.0.1:'+config.port+'/'+name;},stop(){if(started)pg('pg_ctl',['-D',data,'-m','fast','-w','stop']);}};
}
