import { sortedQueryString } from '$lib/utils';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import md5 from 'md5';
const VerifyMd5 = createMiddleware(async (c, next) => {
	const apiKey = c.get('api-key');
	const hash = c.req.header('x-hash');
	const body = c.req.parseBody;
	const sorted = `${sortedQueryString(body)}${apiKey}`;

	if (hash != md5(sorted)) {
		throw new HTTPException(401, { message: 'invalid hash' });
	}

	await next();
});

export default VerifyMd5;
