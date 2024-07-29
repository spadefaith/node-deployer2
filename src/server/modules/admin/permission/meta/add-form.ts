export default {
	controls: [
		{
			tag: 'group',
			display: 'API Information',
			children: [
				{
					display: 'Name',
					name: 'name',
					placeholder: 'name',
					tag: 'input',
					type: 'text',
					label: true,
					validator: 'required=true'
				},
				{
					display: 'Description',
					name: 'description',
					placeholder: 'description',
					tag: 'textarea',
					type: 'text',
					label: true,
					validator: 'required=true'
				},
				{
					display: 'Scope',
					name: 'scope',
					placeholder: 'scope',
					tag: 'select',
					options: [
						{
							value: 'table',
							display: 'Table'
						},
						{
							value: 'toolbar',
							display: 'Toolbar'
						},
						{
							value: 'main_menu',
							display: 'Menu'
						},
						{
							value: 'filter',
							display: 'Filter'
						},
						{
							value: 'sub_menu',
							display: 'Sub Menu'
						}
					],
					label: true,
					validator: 'required=true'
				},
				{
					display: 'Module',
					name: 'module',
					placeholder: 'module',
					tag: 'select',
					options: [
						{
							value: '',
							display: 'Select Module'
						},
						{
							value: 'accounts',
							display: 'Accounts'
						},
						{
							value: 'roles',
							display: 'Roles'
						},
						{
							value: 'permissions',
							display: 'Permissions'
						},
						{
							value: 'role_permissions',
							display: 'Role Permissions'
						},
						{
							value: 'api_collections',
							display: 'Api Collections'
						},
						{
							value: 'api_logs',
							display: 'Api Logs'
						},
						{
							value: 'schedules',
							display: 'Schedules'
						},
						{
							value: 'settings',
							display: 'Settings'
						}
					],
					label: true,
					validator: 'required=true'
				},
				{
					display: 'Status',
					name: 'is_active',
					placeholder: 'status',
					tag: 'select',
					options: [
						{
							value: 1,
							display: 'Active'
						},
						{
							value: 0,
							display: 'In Active'
						}
					],
					label: true,
					validator: 'required=true'
				}
			]
		}
	]
};
