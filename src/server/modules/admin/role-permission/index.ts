import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { parsedEntityJson } from '../../../utils';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import {
	create,
	getMeta,
	getOne,
	getSidebar,
	getToolbar,
	options,
	paginate,
	remove,
	update
} from './controller';
import { requireFromString } from 'module-from-string';
import Models from '~/server/db';
import { common200, common400, commonErrorCallback } from './utils';
import RolePermissionLifecycle from './lifecycle';
const tagName = 'role-permission';
const RolePermissionModule = new OpenAPIHono();
/**
 * get
 */
RolePermissionModule.openapi(
	createRoute({
		method: 'get',
		path: '/',
		tags: [tagName],
		summary: 'get an role-permission',
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
RolePermissionModule.openapi(
	createRoute({
		method: 'post',
		path: '/',
		tags: [tagName],
		summary: 'create an role-permission',
		request: {
			body: {
				description: 'Request body',
				content: {
					'application/json': {
						schema: requireFromString(
							jsonSchemaToZod(parsedEntityJson(Models.RolePermissions), { module: 'cjs' })
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
		const lifecycle = new RolePermissionLifecycle(c);
		await lifecycle.parseCookies();

		const created = await create(lifecycle);
		return c.json({ status: 1, data: created });
	},
	commonErrorCallback
);

/**
 * delete
 */
RolePermissionModule.openapi(
	createRoute({
		method: 'delete',
		path: '/',
		tags: [tagName],
		summary: 'delete an role-permission',
		request: {
			body: {
				description: 'Request body',
				content: {
					'application/json': {
						schema: requireFromString(
							jsonSchemaToZod(parsedEntityJson(Models.RolePermissions, { filter: ['pk'] }), {
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
RolePermissionModule.openapi(
	createRoute({
		method: 'put',
		path: '/',
		tags: [tagName],
		summary: 'update an role-permission',
		request: {
			body: {
				description: 'Request body',
				content: {
					'application/json': {
						schema: requireFromString(
							jsonSchemaToZod(parsedEntityJson(Models.RolePermissions, { filter: ['pk'] }), {
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
 * sidebar
 */
RolePermissionModule.openapi(
	createRoute({
		method: 'get',
		path: '/sidebar',
		tags: [tagName],
		summary: 'get allowed sidebar modules',
		request: {
			query: z.object({
				role_id: z
					.string()
					.min(1)
					.openapi({
						param: {
							name: 'role_id',
							in: 'query'
						},
						example: '1'
					})
			})
		},
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		const data = await getSidebar(c.req.query());
		return c.json({ status: 1, data });
	},
	commonErrorCallback
);

/**
 * toolbar
 */
RolePermissionModule.openapi(
	createRoute({
		method: 'get',
		path: '/toolbar',
		tags: [tagName],
		summary: 'get allowed toolbar modules',
		request: {
			query: z.object({
				role_id: z
					.string()
					.min(1)
					.openapi({
						param: {
							name: 'role_id',
							in: 'query'
						},
						example: '1'
					}),
				module: z
					.string()
					.min(1)
					.openapi({
						param: {
							name: 'module',
							in: 'query'
						},
						example: 'accounts'
					})
			})
		},
		responses: {
			200: common200,
			400: common400
		}
	}),
	async (c) => {
		const data = await getToolbar(c.req.query());
		return c.json({ status: 1, data });
	},
	commonErrorCallback
);

/**
 * meta
 */
RolePermissionModule.openapi(
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
RolePermissionModule.openapi(
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
RolePermissionModule.openapi(
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

export default RolePermissionModule;
