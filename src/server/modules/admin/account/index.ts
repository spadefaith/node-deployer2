import 'dotenv/config';
import { create, getMeta, getOne, options, paginate, remove, update } from './controller';
import Lifecycle from './lifecycle';
import express from 'express';
import VerifyToken from '~/server/middlewares/VerifyToken';

const AccountAdminModule = express.Router();
/**
 * get
 */
AccountAdminModule.get("/",
	async (req,res,next) => {
		const get = await getOne(req.query);
		return res.json({ status: 1, data: get });
	}
);

/**
 * create
 */
AccountAdminModule.post(
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
AccountAdminModule.delete(
	"/",
	async (req,res,next) => {
		const deleted = await remove(req.body);
		return res.json({ status: 1, data: deleted });
	}
);

/**
 * update
 */
AccountAdminModule.put(
	"/",
	async (req,res,next) => {
		const updated = await update(req.body);
		return res.json({ status: 1, data: updated });
	}
);

/**
 * meta
 */
AccountAdminModule.get("/meta",
	async (req,res,next) => {	
		const meta = await getMeta();
		return res.json({ status: 1, data:meta  });
	}
);

/**
 * meta
 */
AccountAdminModule.get(
	"/paginate",
	async (req,res,next) => {
		return res.json({ status: 1, data: await paginate(req.query) });
	}
);

/**
 * options
 */
AccountAdminModule.get(
	"/options",
	async (req,res,next) => {
		return res.json({ status: 1, data: await options(req.query as any) });
	}
);

export default AccountAdminModule;
