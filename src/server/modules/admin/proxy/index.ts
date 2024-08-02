import 'dotenv/config';
import { create,  getOne } from './controller';
import Lifecycle from './lifecycle';
import express from 'express';
import VerifyToken from '~/server/middlewares/VerifyToken';

const ProxyAdminModule = express.Router();
/**
 * get
 */
ProxyAdminModule.get("/",
	async (req,res,next) => {
		const get = await getOne(req.query);
		return res.json({ status: 1, data: get });
	}
);

/**
 * create
 */
ProxyAdminModule.post(
	"/",
	VerifyToken,
	async (req,res,next) => {
		const lifecycle = new Lifecycle(res.locals.admin);

		const created = await create(lifecycle);
		return res.json({ status: 1, data: created as any });
	}
);


export default ProxyAdminModule;
