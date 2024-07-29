export default [
	{ field: 'permission_id', title: 'ID', visible: true },
	// { field: 'ref_name', title: 'Ref', visible: true },
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
	{ field: 'scope', title: 'Scope', visible: true },
	{ field: 'module', title: 'Module', visible: true },

	{
		field: 'actions',
		title: 'Actions',
		visible: true,
		options: [
			{ value: 'edit', label: 'Edit' },
			{ value: 'delete', label: 'Delete' }
		]
	}
];
