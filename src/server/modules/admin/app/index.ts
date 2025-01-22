import 'dotenv/config';
import { create, deployApplication, getMeta, getOne, logCache, options, paginate, remove, update } from './controller';
import Lifecycle from './lifecycle';
import express from 'express';
import VerifyToken from '~/server/middlewares/VerifyToken';
import CacheServerService from '~/services/CacheServerService';
import moment from 'moment';





const AppAdminModule = express.Router();
/**
 * get
 */
AppAdminModule.get("/",
	async (req,res,next) => {
		const get = await getOne(req.query);
		return res.json({ status: 1, data: get });
	}
);

/**
 * create
 */
AppAdminModule.post(
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
AppAdminModule.delete(
	"/",
	VerifyToken,
	async (req,res,next) => {
		const deleted = await remove(req.body);
		return res.json({ status: 1, data: deleted });
	}
);

/**
 * update
 */
AppAdminModule.put(
	"/",
	VerifyToken,
	async (req,res,next) => {
		const updated = await update(req.body);
		return res.json({ status: 1, data: updated });
	}
);

/**
 * meta
 */
AppAdminModule.get("/meta",
	async (req,res,next) => {	
		const meta = await getMeta();
		return res.json({ status: 1, data:meta  });
	}
);

/**
 * meta
 */
AppAdminModule.get(
	"/paginate",
	VerifyToken,
	async (req,res,next) => {
		return res.json({ status: 1, data: await paginate(req.query) });
	}
);

/**
 * options
 */
AppAdminModule.get(
	"/options",
	async (req,res,next) => {
		return res.json({ status: 1, data: await options(req.query as any) });
	}
);

/**
 * log
 */
AppAdminModule.get(
	"/log",
	VerifyToken,
	async (req,res,next) => {
		return res.json({ status: 1, data: await logCache(req.query.name) });
	}
);

/**
 * log
 */
AppAdminModule.get(
	"/deploy",
	// VerifyToken,
	async (req,res,next) => {
		try {
			const app_id: string = req.query.app_id as any;
			const deployed =  await deployApplication(app_id);
			res.json({ status: 1, data:deployed })
		} catch(err){
			next(err);
		}
	}
);

export default AppAdminModule;
