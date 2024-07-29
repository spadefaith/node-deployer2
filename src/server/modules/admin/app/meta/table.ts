export default [
	{ title: 'ID', field: 'app_id', visible: true },
	{ title: 'Name', field: 'name', visible: true },
	{ title: 'Branch', field: 'branch', visible: true },
	{
		title: 'Repo',
		field: 'repo',
		visible: true,
		width: 300,
		height: 400,
		variableHeight: true,
		formatter: 'textarea'
	},

	{
		title: 'Hook Url',
		field: 'webhook_url',
		visible: true,
		width: 300,
		height: 400,
		variableHeight: true,
		formatter: 'textarea'
	},
	{ title: 'Hooked Date', field: 'hooked_date', visible: true },
	{
		field: 'actions',
		title: 'Actions',
		visible: true,
		options: [
			{ value: 'logs', label: 'Logs' },
			{ value: 'redeploy', label: 'Restart' },
			{ value: 'add_env', label: 'Env' },
			{ value: 'edit', label: 'Update' },
			{ value: 'delete', label: 'Delete' }
		]
	}
];
