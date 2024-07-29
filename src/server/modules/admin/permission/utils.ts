import { z } from '@hono/zod-openapi';

export const common400 = {
	description: 'get app',
	content: {
		'application/json': {
			schema: z
				.object({
					status: z.number(),
					data: z.object({}).optional()
				})
				.openapi('common http 400')
		}
	}
};

export const common200 = {
	description: 'failed get',
	content: {
		'application/json': {
			schema: z
				.object({
					status: z.number(),
					message: z.string()
				})
				.openapi('common http 200')
		}
	}
};

export const commonErrorCallback = (result, c) => {
	if (!result.success) {
		return c.json(
			{
				status: 1,
				message: 'Validation Error'
			},
			400
		);
	}
};
