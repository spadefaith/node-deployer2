import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { parsedEntityJson } from '../../../utils';
import { jsonSchemaToZod } from 'json-schema-to-zod';
// import { create, getOne, remove, update } from './controller';
import { requireFromString } from 'module-from-string';
import { common200, common400, commonErrorCallback } from '../../../utils/responses';
import { login, verify } from './controller';

const tagName = 'auth-client';
const AuthClienModule = new OpenAPIHono();
/**
 * get
 */

AuthClienModule.openapi(
	createRoute({
		method: 'post',
		path: '/login',
		tags: [tagName],
		summary: 'login',
		responses: {
			200: common200,
			400: common400
		},
		request: {
			body: {
				description: 'Request body',
				content: {
					'application/json': {
						schema: requireFromString(
							jsonSchemaToZod(
								{
									type: 'object',
									properties: {
										username: { type: 'string', required: true },
										password: { type: 'string', required: true }
									}
								},
								{ module: 'cjs' }
							)
						)
					}
				}
			}
		}
	}),
	async (c) => {
		const token = await login(c.req.parseBody as any);
		return c.json({ status: 1, data: { token } });
	},
	commonErrorCallback
);

AuthClienModule.openapi(
	createRoute({
		method: 'get',
		path: '/verify',
		tags: [tagName],
		summary: 'verify token',
		responses: {
			200: common200,
			400: common400
		},
		request: {
			query: z.object({
				token: z
					.string()
					.min(3)
					.openapi({
						param: {
							name: 'token',
							in: 'query'
						},
						example: '1212121'
					})
			})
		}
	}),
	async (c) => {
		const verifed = await verify(c.req.query() as any);
		return c.json({ status: 1, data: verifed });
	},
	commonErrorCallback
);

export default AuthClienModule;
