module.exports = function (sequelize, DataTypes) {
  const entity = sequelize.define(
    "permissions",
    {
      permission_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING(254),
      description: DataTypes.STRING(254),
      ref_name: DataTypes.STRING(254),
      scope: DataTypes.STRING(200),
      module: DataTypes.STRING(200),
      sequence: DataTypes.INTEGER,

      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
      is_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      updated_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );

  return entity;
};
