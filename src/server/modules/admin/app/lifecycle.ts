import 'dotenv/config';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import fs from 'fs';
import BaseLifecycle from '~/server/classes/BaseLifecycle';
import Models from '~/server/db';
import {randomUUID} from 'node:crypto';
import workerpool from 'workerpool';
import Docker from 'dockerode';
import { AppsCreationAttributes } from '~/server/db/typed-models/Apps';
import { logCache } from './controller';


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

		await new Promise((res, rej) => {
			let error;
	
			process.chdir(PWD);
			pool
				.exec('deploy', [
					{
						root_path,
						branch,
						repo,
						name,
						envs:props.env
					}
				],{
					on: function (payload) {
						logCache(name, payload.message.toString());
					},
				})
				.then(function (result) {
					console.log('Result: ' + result); // outputs 55
				})
				.catch(function (err) {
					error = err.message;
				})
				.then(function () {
					pool.terminate(); // terminate all workers when done
					if (error) {
						rej(error);
					} else {
						res(true);
					}
				});
		});

		return true;
	}
	async beforeDelete(props: { data: { account_id } }) {}
	async beforeUpdate(props: { data: DataType & { modified_by: number } }) {
		props.data.password = bcrypt.hashSync(props.data.password, bcrypt.genSaltSync(10));

		props.data.modified_by = this.admin.account_id;

		return props.data;
	}
	async afterUpdate(props: { data: AppsCreationAttributes , app: AppsCreationAttributes}) {
		const envs = (await Models.Envs.findAll({raw:true,where:{app_id:props.app.app_id}})).reduce((accu,item)=>{

			accu[item.prop_key] = item.prop_value;

			return accu;
		},{});

		process.chdir(PWD);
		
		await new Promise((res, rej) => {
			let error;
	

			pool
				.exec('deploy', [
					{
						root_path:props.app.root_path,
						branch:props.app.branch,
						repo:props.app.repo,
						name:props.app.name,
						envs
					}
				],{
					on: function (payload) {
						logCache(props.app.name, payload.message.toString());
					},
				})
				.then(function (result) {
					console.log('Result: ' + result); // outputs 55
				})
				.catch(function (err) {
					error = err.message;
				})
				.then(function () {
					pool.terminate(); // terminate all workers when done
					if (error) {
						rej(error);
					} else {
						res(true);
					}
				});
		});
	}
}
