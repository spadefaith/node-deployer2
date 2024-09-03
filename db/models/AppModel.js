const { randomUUID } = require("node:crypto");
module.exports = function (Sequelize, DataTypes) {
  const entity = Sequelize.define(
    "apps",
    {
      app_id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },

      webhook_url: {
        type: DataTypes.STRING,
      },
      compose_path: {
        type: DataTypes.STRING,
      },
      root_path: {
        type: DataTypes.STRING,
      },
      proxy_path: DataTypes.STRING,
      provider: {
        type: DataTypes.STRING(50),
      },
      repo: {
        type: DataTypes.STRING,
      },
      branch: {
        type: DataTypes.STRING(50),
      },
      name: DataTypes.STRING(50),
      old_name: DataTypes.STRING(50),
      domain: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
      hooked_date: {
        type: DataTypes.DATE,
        allowNull: true,
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
      indexes: [
        {
          name: "apps_webhook_url_key",
          unique: true,
          fields: [{ name: "webhook_url" }],
        },
        {
          name: "apps_compose_path_key",
          unique: true,
          fields: [{ name: "compose_path" }],
        },
        {
          name: "apps_root_path_key",
          unique: true,
          fields: [{ name: "root_path" }],
        },
        {
          name: "name_branch_key",
          unique: true,
          fields: [{ name: "name" }, { name: "branch" }],
        },
      ],
      hooks: {
        beforeBulkCreate: (record, options) => {
          record.dataValues.app_id = randomUUID();
        },
        beforeCreate: (record, options) => {
          record.dataValues.app_id = randomUUID();
        },
      },
    }
  );

  return entity;
};
