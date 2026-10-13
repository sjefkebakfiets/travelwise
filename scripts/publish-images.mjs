import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
if(process.env.PUBLISH_IMAGES!=='true')throw Error('Image publication requires explicit workflow approval');
const repository=process.env.GITHUB_REPOSITORY?.toLowerCase();if(repository!=='sjefkebakfiets/travelwise')throw Error('Unexpected publication repository');
const version=process.env.IMAGE_TAG;if(!version||!/^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,127}$/.test(version))throw Error('Invalid image tag');
if(!process.env.REGISTRY_TOKEN||!process.env.GITHUB_ACTOR)throw Error('Registry credentials missing');
const metadata=JSON.parse(fs.readFileSync('.tools/docker-images.json','utf8'));if(!/^travelwise-app-test:[a-f0-9]{16}$/.test(metadata.appImage)||!/^travelwise-migrations-test:[a-f0-9]{16}$/.test(metadata.migrationImage))throw Error('Verified test images missing');
const login=spawnSync('docker',['login','ghcr.io','--username',process.env.GITHUB_ACTOR,'--password-stdin'],{input:process.env.REGISTRY_TOKEN,encoding:'utf8'});if(login.status!==0)throw Error('Registry login failed');
function run(args){const r=spawnSync('docker',args,{stdio:'inherit'});if(r.status!==0)throw Error('Image publication command failed');}
for(const [source,name] of [[metadata.appImage,'travelwise'],[metadata.migrationImage,'travelwise-migrations']]){for(const tag of new Set([version,'latest','sha-'+process.env.GITHUB_SHA?.slice(0,12)])){const target='ghcr.io/sjefkebakfiets/'+name+':'+tag;run(['tag',source,target]);run(['push',target]);run(['pull',target]);}}
console.log('Verified application and migration images published to GHCR');
