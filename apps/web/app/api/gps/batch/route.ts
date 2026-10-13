import { endpoint } from '../../../../lib/http.ts';
import { ingestGPS } from '../../../../lib/gps-api.ts';
export const runtime='nodejs';
export const POST=endpoint(ingestGPS);
