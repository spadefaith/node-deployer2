import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { RolePermissions, RolePermissionsId } from './RolePermissions';

export interface PermissionsAttributes {
  permission_id: number;
  name?: string;
  description?: string;
  ref_name?: string;
  scope?: string;
  module?: string;
  sequence?: number;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;
}

export type PermissionsPk = "permission_id";
export type PermissionsId = Permissions[PermissionsPk];
export type PermissionsOptionalAttributes = "permission_id" | "name" | "description" | "ref_name" | "scope" | "module" | "sequence" | "created_by" | "modified_by" | "is_active" | "updated_date" | "created_date";
export type PermissionsCreationAttributes = Optional<PermissionsAttributes, PermissionsOptionalAttributes>;

export class Permissions extends Model<PermissionsAttributes, PermissionsCreationAttributes> implements PermissionsAttributes {
  permission_id!: number;
  name?: string;
  description?: string;
  ref_name?: string;
  scope?: string;
  module?: string;
  sequence?: number;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;

  // Permissions hasMany RolePermissions via permission_id
  role_permissions!: RolePermissions[];
  getRole_permissions!: Sequelize.HasManyGetAssociationsMixin<RolePermissions>;
  setRole_permissions!: Sequelize.HasManySetAssociationsMixin<RolePermissions, RolePermissionsId>;
  addRole_permission!: Sequelize.HasManyAddAssociationMixin<RolePermissions, RolePermissionsId>;
  addRole_permissions!: Sequelize.HasManyAddAssociationsMixin<RolePermissions, RolePermissionsId>;
  createRole_permission!: Sequelize.HasManyCreateAssociationMixin<RolePermissions>;
  removeRole_permission!: Sequelize.HasManyRemoveAssociationMixin<RolePermissions, RolePermissionsId>;
  removeRole_permissions!: Sequelize.HasManyRemoveAssociationsMixin<RolePermissions, RolePermissionsId>;
  hasRole_permission!: Sequelize.HasManyHasAssociationMixin<RolePermissions, RolePermissionsId>;
  hasRole_permissions!: Sequelize.HasManyHasAssociationsMixin<RolePermissions, RolePermissionsId>;
  countRole_permissions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Permissions {
    return Permissions.init({
    permission_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    ref_name: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    scope: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    module: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'permissions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "permission_id" },
        ]
      },
    ]
  });
  }
}
