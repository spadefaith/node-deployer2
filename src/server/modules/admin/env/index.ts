import 'dotenv/config';
import { create, getMeta, getOne, options, paginate, remove, update } from './controller';
import Lifecycle from './lifecycle';
import express from 'express';
import VerifyToken from '~/server/middlewares/VerifyToken';

const EnvAdminModule = express.Router();
/**
 * get
 */
EnvAdminModule.get("/",
	async (req,res,next) => {
		const get = await getOne(req.query);
		return res.json({ status: 1, data: get });
	}
);

/**
 * create
 */
EnvAdminModule.post(
	"/",
	VerifyToken,
	async (req,res,next) => {
		const lifecycle = new Lifecycle(res.locals.admin);

		const created = await create(lifecycle);
		return res.json({ status: 1, data: created as any });
	}
);

/**
 * delete
 */
EnvAdminModule.delete(
	"/",
	async (req,res,next) => {
		const deleted = await remove(req.body);
		return res.json({ status: 1, data: deleted });
	}
);

/**
 * update
 */
EnvAdminModule.put(
	"/",
	async (req,res,next) => {
		const updated = await update(req.body);
		return res.json({ status: 1, data: updated });
	}
);

/**
 * meta
 */
EnvAdminModule.get("/meta",
	async (req,res,next) => {	
		const meta = await getMeta(req.query.app_id);
		return res.json({ status: 1, data:meta  });
	}
);

/**
 * meta
 */
EnvAdminModule.get(
	"/paginate",
	async (req,res,next) => {
		return res.json({ status: 1, data: await paginate(req.query) });
	}
);

/**
 * options
 */
EnvAdminModule.get(
	"/options",
	async (req,res,next) => {
		return res.json({ status: 1, data: await options(req.query as any) });
	}
);

export default EnvAdminModule;
