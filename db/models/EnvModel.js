module.exports =function EnvModel(Sequelize, DataTypes) {
	const entity = Sequelize.define(
		'envs',
		{
			env_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			app_id: {
				type: DataTypes.UUID,
				allowNull: true,
				references: {
					model: 'apps',
					key: 'app_id'
				}
			},
			prop_key: DataTypes.STRING(50),
			prop_value: DataTypes.STRING(50),

			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1
			},
			created_by: {
				type: DataTypes.STRING(50),
				allowNull: false,
				defaultValue: 'SYS'
			},
			modified_by: {
				type: DataTypes.STRING(50),
				allowNull: false,
				defaultValue: 'SYS'
			},

			created_date: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updated_date: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			}
		},
		{
			freezeTableName: true,
			tableName: 'envs',
			timestamps: true,
			createdAt: 'created_date',
			updatedAt: 'updated_date',
			indexes: [
				{
					name: 'envs_app_id_prop_key_prop_value_key',
					unique: true,
					fields: [{ name: 'app_id' }, { name: 'prop_key' }, { name: 'prop_value' }]
				}
			]
		}
	);

	return entity;
}
