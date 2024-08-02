const { randomUUID } = require("node:crypto");
module.exports = function (Sequelize, DataTypes) {
  const entity = Sequelize.define(
    "proxies",
    {
      proxy_id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      app_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "apps",
          key: "app_id",
        },
      },
      config: DataTypes.JSON,

      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1,
      },
      created_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "SYS",
      },
      modified_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "SYS",
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      freezeTableName: true,
      tableName: "apps",
      timestamps: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
      indexes: [],
    }
  );

  return entity;
};
