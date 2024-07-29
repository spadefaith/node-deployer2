export default [
	{ field: 'role_permission_id', title: 'ID', visible: true },
	{ field: 'role.name', title: 'Role', visible: true },
	{ field: 'permission.name', title: 'Permission', visible: true },
	{ field: 'permission.scope', title: 'Scope', visible: true },
	{ field: 'permission.module', title: 'Module', visible: true },

	{
		field: 'actions',
		title: 'Actions',
		visible: true,
		options: [
			{ value: 'edit', label: 'Edit' },
			{ value: 'delete', label: 'Delete' }
		]
	},
	{ field: 'role_id', title: 'Role ID', visible: false },
	{ field: 'permission_id', title: 'Permission ID', visible: false }
];
