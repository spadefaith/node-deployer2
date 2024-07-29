import { mergeTo } from "../utils";
import Models from "../db";

type SidebarItemType = {
	display: string;
	ref_name: string;
	link: string;
	id: number;
	icon: string;
};

export default class Toolbar {
	default: SidebarItemType[];
	subMenu: any;
	constructor() {
		this.default = [
			this._createItem({
				display: 'Add',
				ref_name: 'accounts',
				id: 1,
				icon: 'fa-user-shield'
			}),
			this._createItem({
				display: 'Download',
				ref_name: 'settings',
				id: 7,
				icon: 'fa-user-cog'
			})
		];
		this.subMenu = {};
	}
	_createItem(data: {
		display: string;
		ref_name: string;
		link?: string;
		id?: number;
		icon?: string;
	}) {
		return {
			display: data.display,
			ref_name: data.ref_name,
			link: '',
			id: data.id || 0,
			icon: data.icon || ''
		};
	}
	async _getAllowedModules(role_id, module?, scope?) {
		return await Models.RolePermissions.findAll({
			raw: true,
			include: [
				{
					model: Models.Permissions,
					as: 'permission',
					where: {
						...mergeTo(module, { module }),
						...mergeTo(scope, { scope })
					},
					attributes: [
						'description',
						'permission_id',
						'ref_name',
						'module',
						'scope',
						'sequence',
						'name'
					]
				}
			],
			attributes: ['role_permission_id', 'role_id', 'permission_id', 'is_active'],
			where: {
				role_id: role_id
			},
			nest: true
		});
	}
	async _getSubmenu(role_id, module) {
		if (!this.subMenu[module]) {
			return null;
		}

		const data = await this._getAllowedModules(role_id, module, 'sub_menu');

		return data.map((item) => {
			const find = this.subMenu[module].find(
				(settingItem) => settingItem?.ref_name == item?.permission?.ref_name
			);

			return find
				? find
				: {
						display: item?.permission?.description,
						ref_name: item?.permission?.ref_name,
						link: `/${
							item?.permission?.ref_name
								? String(item?.permission?.ref_name).replaceAll('_', '-')
								: ''
						}`,
						id: item.permission_id,
						icon: 'fa-user-cog'
					};
		});
	}
	_format(str) {
		return str.replaceAll('_', '-');
	}
	async get(role_id, module) {
		const getModules = await this._getAllowedModules(role_id, module, 'toolbar');
		return Promise.all(
			getModules.map((item) => {
				return {
					display: item.permission.name,
					ref_name: item.permission.ref_name,
					id: item.permission_id,
					icon: 'fa-user-cog',
					link: this._format(`/${item.permission.ref_name}`)
				};
			})
		);
	}
}
