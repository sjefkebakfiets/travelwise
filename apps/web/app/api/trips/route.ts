import { endpoint } from '../../../lib/http.ts';
import { listTrips,createTrip } from '../../../lib/trips.ts';
export const runtime='nodejs';
export const GET=endpoint(listTrips);
export const POST=endpoint(createTrip);
