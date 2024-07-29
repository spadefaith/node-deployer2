import bcrypt from 'bcryptjs';

import BaseLifecycle from '~/server/classes/BaseLifecycle';


type DataType = {
	first_name: string;
	last_name: string;
	middle_name: string;
	email: string;
	username: string;
	password: string;
	is_active: string;
	location_id: number;
	role_id: number;
	commission_deposit: string;
	commission_withdraw: string;
	balance_lower_limit: string;
	trx_lower_limit: string;
	trx_high_limit: string;
	admin_id: string;
	agent_id: string;
	priority: string;
	sequence: string;
};

export default class Lifecycle extends BaseLifecycle {
	constructor(opts) {
		super(opts);
	}
	async beforeCreate(props: { data: DataType }) {
		props.data.password =bcrypt.hashSync(props.data.password, bcrypt.genSaltSync(10));
		return {
			data: {
				...props.data,
				created_by: this.admin.username
			}
		};
	}
	async afterCreate(props: { mutate: any }) {
		const account_id = props.mutate.account_id;

		return true;
	}
	async beforeDelete(props: { data: { account_id } }) {}
	async beforeUpdate(props: { data: DataType & { modified_by: number } }) {
		props.data.password = bcrypt.hashSync(props.data.password, bcrypt.genSaltSync(10));

		props.data.modified_by = this.admin.account_id;

		return props.data;
	}
	async afterUpdate(props: { data: DataType & { agent_id: number } }) {}
}
