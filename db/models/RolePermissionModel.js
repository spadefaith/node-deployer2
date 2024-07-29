module.exports = function (sequelize, DataTypes) {
  const entity = sequelize.define(
    "role_permissions",
    {
      role_permission_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
          key: "role_id",
        },
      },
      permission_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "permissions",
          key: "permission_id",
        },
      },

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
      indexes: [
        {
          name: "role_id_permission_id",
          unique: true,
          using: "BTREE",
          fields: [{ name: "role_id" }, { name: "permission_id" }],
        },
      ],
    }
  );

  return entity;
};
