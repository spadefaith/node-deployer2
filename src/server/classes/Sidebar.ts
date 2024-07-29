import { mergeTo } from '../utils';
import Models from '../db';
type SidebarItemType = {
	display: string;
	ref_name: string;
	link: string;
	id: number;
	icon: string;
};

export default class Sidebar {
	default: SidebarItemType[];
	subMenu: any;
	constructor() {
		this.default = [
			this._createItem({
				display: 'Accounts',
				ref_name: 'accounts',
				id: 1,
				icon: 'fa-user-shield'
			}),
			this._createItem({
				display: 'Settings',
				ref_name: 'settings',
				id: 7,
				icon: 'fa-user-cog'
			})
		];
		this.subMenu = {
			settings: [
				this._createItem({
					display: 'Role',
					ref_name: 'roles',
					id: 4,
					icon: 'fa-user-cog'
				}),
				this._createItem({
					display: 'Role Permissions',
					ref_name: 'role_permissions',
					id: 5,
					icon: 'fa-user-cog'
				})
			],
			accounts: [
				this._createItem({
					display: 'Priority',
					ref_name: 'priority',
					id: 6,
					icon: 'fa-user-cog'
				})
			]
		};
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
			link: `/${String(data.ref_name).replaceAll('_', '-')}`,
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
	async get(role_id) {
		const getModules = await this._getAllowedModules(role_id, null, 'main_menu');
		return Promise.all(
			getModules
				.map((item) => {
					return {
						display: item.permission.name,
						ref_name: item.permission.ref_name,
						id: item.permission_id,
						icon: 'fa-user-cog',
						link: this._format(`/${item.permission.ref_name}`)
					};
				})
				.map(async (item: any) => {
					const subMenu = await this._getSubmenu(role_id, item.ref_name);

					if (item.ref_name == 'settings' && subMenu) {
						item.child = subMenu.map((item) => {
							item.link = this._format(`/settings/${item.ref_name}`);
							return item;
						});
					} else if (item.ref_name == 'accounts' && subMenu) {
						item.child = subMenu.map((item) => {
							item.link = this._format(`/accounts/${item.ref_name}`);
							return item;
						});
					}

					return item;
				})
		);
	}
}
