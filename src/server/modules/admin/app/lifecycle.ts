import 'dotenv/config';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import BaseLifecycle from '~/server/classes/BaseLifecycle';
import Models from '~/server/db';
import {randomUUID} from 'node:crypto';
import Docker from 'dockerode';
import { AppsCreationAttributes } from '~/server/db/typed-models/Apps';
import { removeContainer } from './utils';

const PWD = process.env.PWD;

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
	async beforeCreate(props: { data: any }) {
		const env = props.data.env || {};
		delete props.data.env;
		const docker = new Docker();
		const findImage = await new Promise((res,rej)=>{
			let found = null;
			docker.listContainers(function (err, containers) {
				containers.forEach(function (containerInfo) {
					if(containerInfo.Image == props.data.name){
						found = containerInfo;
					}
				});
			});

			res(found);
		});
		if(findImage){
			throw new Error(`Image name ${props.data.name} is already existed`);
		};
		const root = path.join(process.env.PWD, '../apps', `${props.data.name}`);



		return {
			data: {
				...props.data,
				created_by: this.admin.username,
				app_id:randomUUID(),
				compose_path: root,
				root_path: root,
			},
			env
		};
	}
	async afterCreate(props: { mutate: any, env: any, data:any }) {
		const { root_path, repo, branch, name } = props.data;
		/**
		 * delete all env if found;
		 */
		await Models.Apps.update({
			webhook_url:`${process.env.BASE_URL}/api/admin/app/redeploy/${props.data.app_id}`
		},{
			where:{
				app_id:props.data.app_id
			}
		});

		const envs = Object.keys(props.env).reduce((accu, key)=>{
			accu.push({
				app_id:props.data.app_id,
				prop_key:key,
				prop_value:props.env[key],
			})
			return accu;
		},[]);


		await Models.Envs.bulkCreate(envs)


		return true;
	}
	async beforeDelete (props: { app_id: number })  {

	
	
	};
	async beforeUpdate(props: { data: DataType & { modified_by: number } }) {


	}
	async afterUpdate(props: { data: AppsCreationAttributes , app: AppsCreationAttributes}) {


		const newName = props.data.name;
		const oldName = props.app.name;

		if(newName == oldName){
			return;
		}

		/**
		 * create new root_path from new name;
		 */
		const root_path = path.join(PWD, "../apps", `${newName}`);


		await Models.Apps.update({root_path, compose_path:root_path}, {
			where: {
				app_id: props.app.app_id
			}
		});

		/**
		 * remove old container from old name;
		 */
		await removeContainer(oldName);



	}
}
