module.exports = function (sequelize, DataTypes) {
  const entity = sequelize.define(
    "accounts",
    {
      account_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      first_name: DataTypes.STRING(100),
      last_name: DataTypes.STRING(100),
      username: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      password: DataTypes.STRING(100),
      email: DataTypes.STRING(100),
      token: DataTypes.STRING(100),
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
          key: "role_id",
        },
      },
      last_login_date: DataTypes.DATE,

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
          name: "first_name_last_name",
          unique: true,
          using: "BTREE",
          fields: [{ name: "first_name" }, { name: "last_name" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "username",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
      ],
    }
  );

  return entity;
};
