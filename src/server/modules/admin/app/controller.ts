import 'dotenv/config';
import Sidebar from '~/server/classes/Sidebar';
import Models from '~/server/db';
import { getPk } from '../../../utils';
import meta from './meta/meta';
import Lifecycle from './lifecycle';
import fs from 'fs';
import { deployContainer } from './utils';
import CacheServerService from '~/services/CacheServerService';
import moment from 'moment';
const PWD = process.env.PWD;

const pk = getPk(Models.Apps);
const logCacheData = {};

const _cache = new CacheServerService('deploy');

export const create = async (lifecycle: Lifecycle) => {
	const { data, env } = await lifecycle.beforeCreate({ data: lifecycle.body });

	console.log(13,data);
	const create = await Models.Apps.create(data as any);


	await lifecycle.afterCreate({ mutate: create, data,env });


	return true

};

export const bulkCreate = async (payload) => {
	return Models.Apps.create(payload);
};

export const update = async (lifecycle: Lifecycle) => {
	const payload: any = lifecycle.body;

	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	const pkv = payload[pk];
	delete payload[pk];


	const find = await Models.Apps.findOne({
		raw:true,
		where:{
			[pk]:pkv
		}
	});

	if(!find){
		throw new Error('app is not existed');
	};

	payload.old_name = find.name;

	await Models.Apps.update(payload, {
		where: {
			[pk]: pkv
		}
	});



	lifecycle.afterUpdate({
		data:{
			...payload,
			[pk]:pkv
		},
		app:find
	});

};

export const remove = (payload) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}



	return Models.Apps.destroy({
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getOne: any = (payload) => {
	return Models.Apps.findOne({
		raw: true,
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getMany = () => {
	return Models.Apps.findAll({
		raw: true
	});
};

export const getSidebar = async (admin) => {
	const sidebar = new Sidebar();
	const sidebarData = await sidebar.get(admin.role_id);

	return sidebarData;
};

export const getMeta = async () => {
	return meta;
};

export const paginate = async (params) => {
	const page = params.page;
	const offset = (params.page - 1) * params.size;
	const limit = Number(params.size);
	delete params.page;
	delete params.size;

	const where = Object.keys(params).reduce((accu, key) => {
		accu[key] = params[key];
		return accu;
	}, {});

	let query = await Models.Apps.findAndCountAll({
		raw: true,
		where,
		offset,
		limit,
		order: [['updated_date', 'DESC']],

		nest: true
	});

	return {
		last_page: Math.ceil(query.count / limit),
		last_row: query.count,
		page,
		data: query.rows
	};
};

export const options = (params: {
	type: string;
	module: string;
	attributes: string;
	defaultValue: string;
}) => {
	let attributes = [];
	try {
		attributes = JSON.parse(params.attributes);
	} catch (err) {
		console.log(err);
	}

	console.log(112, params);

	if (params.module == 'role') {
		return Models.Apps.findAll({
			raw: true,
			attributes,

		});
	}
	return;
};


export const logCache =  (name, message?)=>{
	if(!logCacheData[name]){
		logCacheData[name] = [];
	};
	if(message){
		logCacheData[name].push(message);
	} else {
		const logs = JSON.parse(JSON.stringify(logCacheData[name]));
		logCacheData[name] = logs.slice(1,logs.length);

		const m = logs[0];


		return m;
	};

}

export const getLogs = (name)=>{
	const filePath = `${PWD}/logs/${name}.txt`;
	console.log(188,filePath);
	const content = fs.readFileSync(filePath, "utf8");
	console.log(189,content);

	return content;
}

export const deployApplication = async (app_id)=>{
	if(!app_id){
		throw new Error('app_id is required');
	};

	// throw new Error('deployApplication is not implemented');
	const get = await _cache.getStore(app_id, true);
	const expiration = moment().add(30, "minutes").format("YYYY-MM-DD HH:mm:ss");

	if (!get) {
		await _cache.setStore(app_id, {
		retry: 1,
		expired: expiration,
		});
	} else {
		const { retry, expired } = get;
		const retryN = Number(retry);
		const isExpired = moment().isAfter(moment(expired));

		if (retryN + 1 > 3) {
		if (isExpired) {
			await _cache.setStore(app_id, {
			retry: 1,
			expired: expiration,
			});
		} else {
			throw new Error("disable login");
		}
		} else {
		await _cache.setStore(app_id, {
			retry: retryN + 1,
			expired: get.expired,
		});
		}
	}

	await deployContainer(app_id);
	await _cache.destroyStore(app_id);
}