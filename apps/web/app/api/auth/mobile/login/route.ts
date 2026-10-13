import { endpoint } from '../../../../../lib/http.ts';
import { mobileLogin } from '../../../../../lib/auth.ts';
export const runtime='nodejs';
export const POST=endpoint(mobileLogin);
