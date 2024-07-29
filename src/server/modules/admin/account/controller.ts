import Sidebar from '~/server/classes/Sidebar';
import Models from '~/server/db';
import { getPk } from '../../../utils';
import meta from './meta/meta';
import Lifecycle from './lifecycle';

const pk = getPk(Models.Accounts);

export const create = async (lifecycle: Lifecycle) => {
	const { data } = await lifecycle.beforeCreate({ data: lifecycle.body });

	console.log(12,data);

	const create = await Models.Accounts.create(data as any);

	console.log(13,create);

	return create;
};

export const bulkCreate = async (payload) => {
	return Models.Accounts.create(payload);
};

export const update = (payload: any) => {
	console.log(30,pk,payload, payload[pk]);
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	

	// return Models.Accounts.update(payload, {
	// 	where: {
	// 		[pk]: payload[pk]
	// 	}
	// });
};

export const remove = (payload) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	return Models.Accounts.destroy({
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getOne: any = (payload) => {
	return Models.Accounts.findOne({
		raw: true,
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getMany = () => {
	return Models.Accounts.findAll({
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

	let query = await Models.Accounts.findAndCountAll({
		raw: true,
		where,
		offset,
		limit,
		order: [['updated_date', 'DESC']],
		include: [
			{
				model: Models.Roles,
				as: 'role'
			}
		],
		attributes: ['email', 'username', 'role_id', 'account_id'],
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
	attributes: any;
	defaultValue: string;
	value:string;
	label:string;
}) => {
	let attributes: any = [
		[params.value,'value'],
		[params.label,'label'],
	];

	


	if (params.module == 'role') {
		return Models.Roles.findAll({
			raw: true,
			attributes:[
				["role_id","value"],
				["name","label"],
			],
			where: {
				is_active: 1
			}
		});
	}
	return;
};
