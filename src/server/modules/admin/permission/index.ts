import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { parsedEntityJson } from '../../../utils';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import { create, getMeta, getOne, options, paginate, remove, update } from './controller';
import { requireFromString } from 'module-from-string';
import Models from '~/server/db';
import { common200, common400, commonErrorCallback } from './utils';
import PermissionLifecycle from './lifecycle';
const tagName = 'permission';
const PermissionModule = new OpenAPIHono();
/**
 * get
 */
PermissionModule.openapi(
	createRoute({
		method: 'get',
		path: '/',
		tags: [tagName],
		summary: 'get an permission',
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		const get = await getOne(c.req.query);
		return c.json({ status: 1, data: get });
	},
	commonErrorCallback
);

/**
 * create
 */
PermissionModule.openapi(
	createRoute({
		method: 'post',
		path: '/',
		tags: [tagName],
		summary: 'create an permission',
		request: {
			body: {
				description: 'Request body',
				content: {
					'application/json': {
						schema: requireFromString(
							jsonSchemaToZod(parsedEntityJson(Models.Permissions), { module: 'cjs' })
						)
					}
				}
			}
		},
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		const lifecycle = new PermissionLifecycle(c);
		await lifecycle.parseCookies();

		const created = await create(lifecycle);
		return c.json({ status: 1, data: created });
	},
	commonErrorCallback
);

/**
 * delete
 */
PermissionModule.openapi(
	createRoute({
		method: 'delete',
		path: '/',
		tags: [tagName],
		summary: 'delete an permission',
		request: {
			body: {
				description: 'Request body',
				content: {
					'application/json': {
						schema: requireFromString(
							jsonSchemaToZod(parsedEntityJson(Models.Permissions, { filter: ['pk'] }), {
								module: 'cjs'
							})
						)
					}
				}
			}
		},
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		const deleted = await remove(c.req.parseBody);
		return c.json({ status: 1, data: deleted });
	},
	commonErrorCallback
);

/**
 * update
 */
PermissionModule.openapi(
	createRoute({
		method: 'put',
		path: '/',
		tags: [tagName],
		summary: 'update an permission',
		request: {
			body: {
				description: 'Request body',
				content: {
					'application/json': {
						schema: requireFromString(
							jsonSchemaToZod(parsedEntityJson(Models.Permissions, { filter: ['pk'] }), {
								module: 'cjs'
							})
						)
					}
				}
			}
		},
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		const updated = await update(c.req.parseBody);
		return c.json({ status: 1, data: updated });
	},
	commonErrorCallback
);

/**
 * meta
 */
PermissionModule.openapi(
	createRoute({
		method: 'get',
		path: '/meta',
		tags: [tagName],
		summary: 'get meta',
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		return c.json({ status: 1, data: await getMeta() });
	},
	commonErrorCallback
);

/**
 * meta
 */
PermissionModule.openapi(
	createRoute({
		method: 'get',
		path: '/paginate',
		tags: [tagName],
		summary: 'get paginated data',
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		return c.json({ status: 1, data: await paginate(c.req.query()) });
	},
	commonErrorCallback
);

/**
 * options
 */
PermissionModule.openapi(
	createRoute({
		method: 'get',
		path: '/options',
		tags: [tagName],
		summary: 'get options data',
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		return c.json({ status: 1, data: await options(c.req.query() as any) });
	},
	commonErrorCallback
);

export default PermissionModule;
