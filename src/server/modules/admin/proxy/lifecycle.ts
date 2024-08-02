import bcrypt from 'bcryptjs';

import BaseLifecycle from '~/server/classes/BaseLifecycle';
import Models from '~/server/db';
import path from 'node:path';
import { AppsCreationAttributes } from '~/server/db/typed-models/Apps';
import workerpool from 'workerpool';
import { deployContainer } from '~/server/modules/admin/app/utils';



const PWD = process.env.PWD;
const pool = workerpool.pool(path.join(PWD, 'deploy.js'));

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
	async beforeCreate(props: { data: ({prop_key:string, prop_value:string, app_id:string,created_by?:string})[] }) {

		/**
		 * delete all
		 */

		const appId = (props?.data[0] || {})?.app_id;


		/**
		 * find app
		 */
		const app = await Models.Apps.findOne({raw:true,where:{app_id:appId}});

		if(!app){
			throw new Error('app not found');
		};

		await Models.Envs.destroy({where:{
			app_id: appId,
		}});
		
		return {
			data: props.data.map((item)=>{
				item.created_by= this.admin.username
				return item;
			}),
			app
		};
	}
	async afterCreate(props: { app: AppsCreationAttributes }) {

		await deployContainer(props.app.app_id);
		
		
		return true;
	}
	async beforeDelete(props: { data: { account_id } }) {}
	async beforeUpdate(props: { data: DataType & { modified_by: number } }) {

	}
	async afterUpdate(props: { data: DataType & { agent_id: number } }) {}
}
