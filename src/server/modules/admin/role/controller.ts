import Models from '~/server/db';
import { utcToTimezone } from '../../../utils';
import { getPk } from '../../../utils';
import RoleLifecycle from './lifecycle';
import meta from './meta/meta';

const pk = getPk(Models.Roles);

export const create = async (lifecycle: RoleLifecycle) => {
	const { data } = await lifecycle.beforeCreate({ data: lifecycle.body });

	return Models.Roles.create(data as any);
};

export const bulkCreate = async (payload) => {
	return Models.Roles.create(payload);
};

export const update = (payload: any) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	return Models.Roles.update(payload, {
		where: {
			[pk]: payload[pk]
		}
	});
};

export const remove = (payload) => {
	if (payload[pk] == undefined) {
		throw new Error(`${pk} is undefined`);
	}

	return Models.Roles.destroy({
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getOne: any = (payload) => {
	return Models.Roles.findOne({
		raw: true,
		where: {
			[pk]: payload[pk]
		}
	});
};

export const getMany = () => {
	return Models.Roles.findAll({
		raw: true
	});
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

	let query = await Models.Roles.findAndCountAll({
		raw: true,
		where,
		offset,
		limit,
		order: [['created_date', 'DESC']],

		nest: true
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

	if (params.module == 'callback') {

	} else if (params.module == 'schedule') {

	}
	return;
};
