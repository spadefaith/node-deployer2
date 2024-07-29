export default [
	{ field: 'role_id', title: 'ID', visible: true },
	{ field: 'ref_name', title: 'Ref', visible: true },
	{ field: 'name', title: 'Name', visible: true },
	{
		field: 'description',
		title: 'Description',
		visible: true,
		show: true,
		variableHeight: true,
		formatter: 'textarea',
		width: 200
	},

	{
		field: 'actions',
		title: 'Actions',
		visible: true,
		options: [
			{ value: 'add_permission', label: 'Permission' },
			{ value: 'edit', label: 'Edit' },
			{ value: 'delete', label: 'Delete' }
		]
	}
];
