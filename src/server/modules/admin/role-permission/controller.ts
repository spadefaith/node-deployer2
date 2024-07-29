import Sidebar from '~/server/classes/Sidebar';
import Toolbar from '~/server/classes/Toolbar';
import Models from '~/server/db';
import { utcToTimezone } from '../../../utils';
import { getPk } from '../../../utils';
import RolePermissionLifecycle from './lifecycle';
import meta from './meta/meta';

const pk = getPk(Models.RolePermissions);

export const create = async (lifecycle: RolePermissionLifecycle) => {
	const { data } = await lifecycle.beforeCreate({ data: lifecycle.body });

	return Models.RolePermissions.create(data as any);
};

export const bulkCreate = async (payload) => {
	return Models.RolePermissions.create(payload);
};

export const update = (payload: any) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	return Models.RolePermissions.update(payload, {
		where: {
			[pk]: payload[pk]
		}
	});
};

export const remove = (payload) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	return Models.RolePermissions.destroy({
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getOne: any = (payload) => {
	return Models.RolePermissions.findOne({
		raw: true,
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getMany = () => {
	return Models.RolePermissions.findAll({
		raw: true
	});
};

export const getSidebar = async (params) => {
	const sidebar = new Sidebar();
	const sidebarData = await sidebar.get(params.role_id);

	return sidebarData;
};

export const getToolbar = async (params) => {
	const toolbar = new Toolbar();
	const toolbarData = await toolbar.get(params.role_id, params.module);

	return toolbarData;
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

	let query = await Models.RolePermissions.findAndCountAll({
		raw: true,
		where,
		offset,
		limit,
		order: [['created_date', 'DESC']],
		nest: true,
		include: [
			{
				model: Models.Roles,
				as: 'role'
			},
			{
				model: Models.Permissions,
				as: 'permission'
			}
		],
	});

	query.rows = query.rows.map((item) => {
		item.created_date = utcToTimezone(item.created_date, 'Asia/Taipei').format(
			'YYYY-MM-DD HH:mm'
		) as any;

		return item;
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
		return Models.Roles.findAll({
			raw: true,
			attributes,
			where: {
				is_active: 1
			}
		});
	} else if (params.module == 'permission') {
		return Models.Permissions.findAll({
			raw: true,
			attributes,
			where: {
				is_active: 1
			}
		});
	}
	return;
};
