import { endpoint } from '../../../../../lib/http.ts';
import { mobileRefresh } from '../../../../../lib/auth.ts';
export const runtime='nodejs';
export const POST=endpoint(mobileRefresh);
