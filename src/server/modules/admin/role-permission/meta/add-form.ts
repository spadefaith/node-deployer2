export default {
	controls: [
		{
			tag: 'group',
			display: 'API Information',
			children: [
				{
					display: 'Role',
					name: 'role_id',
					placeholder: 'role',
					tag: 'select',
					options: [],
					label: true,
					relation: {
						path: '/api/role-permission/options?type=form&module=role',
						attributes: [
							['role_id', 'value'],
							['name', 'display']
						],
						defaultValue: 'Select Role'
					}
					// validator: 'required=true'
				},
				{
					display: 'Permission',
					name: 'permission_id',
					placeholder: 'role',
					tag: 'select',
					options: [],
					label: true,
					relation: {
						path: '/api/role-permission/options?type=form&module=permission',
						attributes: [
							['permission_id', 'value'],
							['name', 'display']
						],
						defaultValue: 'Select Permission'
					}
					// validator: 'required=true'
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
