export default [
	{ field: 'account_id', title: 'ID', visible: true },
	{ field: 'first_name', title: 'First Name', visible: false },
	{ field: 'last_name', title: 'Last Name', visible: false },
	{
		field: 'role.description',
		title: 'Role',
		visible: true
	},
	{ field: 'email', title: 'Email', visible: true },
	{ field: 'username', title: 'Username', visible: true },

	{
		field: 'actions',
		title: 'Actions',
		visible: true,
		options: [
			{ value: 'edit', label: 'Edit' },
			{ value: 'delete', label: 'Delete' }
		]
	},

	{
		field: 'role_id',
		title: 'Role ID',
		visible: false
	},
	{
		field: 'status',
		title: 'Status',
		visible: false
	}
];
