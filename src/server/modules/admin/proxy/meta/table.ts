export default [
	{ title: 'ID', field: 'env_id', visible: true },
	{ title: 'App', field: 'app.name', visible: true },

	{ title: 'Key', field: 'prop_key', visible: true },
	{
		title: 'Value',
		field: 'prop_value',
		visible: true,
		width: 300,
		height: 400,
		variableHeight: true,
		formatter: 'textarea'
	}
];
