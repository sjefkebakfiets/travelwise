import {randomBytes} from 'node:crypto';
import {localPostgres,run} from './local-postgres.mjs';
const cluster=localPostgres('test');
try {const env={...cluster.env,DATABASE_URL:cluster.createDatabase('travelwise_test_'+randomBytes(8).toString('hex')),TRAVELWISE_INTEGRATION:'1'};run(['node_modules/prisma/build/index.js','generate','--config','apps/web/prisma.config.ts'],env);run(['node_modules/prisma/build/index.js','migrate','deploy','--config','apps/web/prisma.config.ts'],env);run(['--test','apps/web/tests/integration.test.ts'],env);}finally{cluster.stop();}
