import Sidebar from '~/server/classes/Sidebar';
import Models from '~/server/db';
import { getPk } from '../../../utils';
import meta from './meta/meta';
import Lifecycle from './lifecycle';
import { mergeTo } from '~/utils';
import addForm from './meta/add-form';

const pk = getPk(Models.Envs);

export const create = async (lifecycle: Lifecycle) => {


	const { data,app } = await lifecycle.beforeCreate({ data: lifecycle.body });

	await Models.Envs.bulkCreate(data as any);

	await lifecycle.afterCreate({app})
};

export const bulkCreate = async (payload) => {
	return Models.Envs.create(payload);
};

export const update = (payload: any) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	return Models.Envs.update(payload, {
		where: {
			[pk]: payload[pk]
		}
	});
};

export const remove = (payload) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	return Models.Envs.destroy({
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getOne: any = (payload) => {
	return Models.Envs.findOne({
		raw: true,
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getMany = (query) => {
	
	return Models.Envs.findAll({
		raw: true,
		...mergeTo(query, {
			where:query
		})
	});
};

export const getSidebar = async (admin) => {
	const sidebar = new Sidebar();
	const sidebarData = await sidebar.get(admin.role_id);

	return sidebarData;
};

export const getMeta = async (app_id) => {

	const createForm = await addForm(app_id);

	meta.components.form.add = createForm;

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


	let query = await Models.Envs.findAndCountAll({
		raw: true,
		where,
		offset,
		limit,
		include:[{
			model:Models.Apps,
			as:'app'
		}],
		order: [['updated_date', 'DESC']],

		nest: true
	});

	// console.log(query.rows)

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
	attributes: any;
	defaultValue: string;
	value:string;
	label:string;
}) => {
	let attributes: any = [
		[params.value,'value'],
		[params.label,'label'],
	];



	console.log(112, params);

	if (params.module == 'app') {
		return Models.Envs.findAll({
			raw: true,
			attributes,

		});
	}
	return;
};
