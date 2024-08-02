import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Envs, EnvsId } from './Envs';

export interface AppsAttributes {
  app_id: string;
  webhook_url?: string;
  compose_path?: string;
  root_path?: string;
  provider?: string;
  repo?: string;
  branch?: string;
  name?: string;
  old_name?: string;
  domain?: string;
  category?: string;
  status: string;
  created_by: string;
  modified_by: string;
  hooked_date?: Date;
  created_date?: Date;
  updated_date?: Date;
}

export type AppsPk = "app_id";
export type AppsId = Apps[AppsPk];
export type AppsOptionalAttributes = "webhook_url" | "compose_path" | "root_path" | "provider" | "repo" | "branch" | "name" | "old_name" | "domain" | "category" | "status" | "created_by" | "modified_by" | "hooked_date" | "created_date" | "updated_date";
export type AppsCreationAttributes = Optional<AppsAttributes, AppsOptionalAttributes>;

export class Apps extends Model<AppsAttributes, AppsCreationAttributes> implements AppsAttributes {
  app_id!: string;
  webhook_url?: string;
  compose_path?: string;
  root_path?: string;
  provider?: string;
  repo?: string;
  branch?: string;
  name?: string;
  old_name?: string;
  domain?: string;
  category?: string;
  status!: string;
  created_by!: string;
  modified_by!: string;
  hooked_date?: Date;
  created_date?: Date;
  updated_date?: Date;

  // Apps hasMany Envs via app_id
  envs!: Envs[];
  getEnvs!: Sequelize.HasManyGetAssociationsMixin<Envs>;
  setEnvs!: Sequelize.HasManySetAssociationsMixin<Envs, EnvsId>;
  addEnv!: Sequelize.HasManyAddAssociationMixin<Envs, EnvsId>;
  addEnvs!: Sequelize.HasManyAddAssociationsMixin<Envs, EnvsId>;
  createEnv!: Sequelize.HasManyCreateAssociationMixin<Envs>;
  removeEnv!: Sequelize.HasManyRemoveAssociationMixin<Envs, EnvsId>;
  removeEnvs!: Sequelize.HasManyRemoveAssociationsMixin<Envs, EnvsId>;
  hasEnv!: Sequelize.HasManyHasAssociationMixin<Envs, EnvsId>;
  hasEnvs!: Sequelize.HasManyHasAssociationsMixin<Envs, EnvsId>;
  countEnvs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Apps {
    return Apps.init({
    app_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    webhook_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "apps_webhook_url_key"
    },
    compose_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "apps_compose_path_key"
    },
    root_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "apps_root_path_key"
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    repo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    branch: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    old_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "domain"
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "1"
    },
    created_by: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "SYS"
    },
    modified_by: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "SYS"
    },
    hooked_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'apps',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "app_id" },
        ]
      },
      {
        name: "domain",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "domain" },
        ]
      },
      {
        name: "apps_webhook_url_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "webhook_url" },
        ]
      },
      {
        name: "apps_compose_path_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "compose_path" },
        ]
      },
      {
        name: "apps_root_path_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "root_path" },
        ]
      },
      {
        name: "name_branch_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
          { name: "branch" },
        ]
      },
    ]
  });
  }
}
