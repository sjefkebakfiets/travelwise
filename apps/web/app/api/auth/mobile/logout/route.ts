import { endpoint } from '../../../../../lib/http.ts';
import { mobileLogout } from '../../../../../lib/auth.ts';
export const runtime='nodejs';
export const POST=endpoint(mobileLogout);
