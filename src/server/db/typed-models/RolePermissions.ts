import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Permissions, PermissionsId } from './Permissions';
import type { Roles, RolesId } from './Roles';

export interface RolePermissionsAttributes {
  role_permission_id: number;
  role_id?: number;
  permission_id?: number;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;
}

export type RolePermissionsPk = "role_permission_id";
export type RolePermissionsId = RolePermissions[RolePermissionsPk];
export type RolePermissionsOptionalAttributes = "role_permission_id" | "role_id" | "permission_id" | "created_by" | "modified_by" | "is_active" | "updated_date" | "created_date";
export type RolePermissionsCreationAttributes = Optional<RolePermissionsAttributes, RolePermissionsOptionalAttributes>;

export class RolePermissions extends Model<RolePermissionsAttributes, RolePermissionsCreationAttributes> implements RolePermissionsAttributes {
  role_permission_id!: number;
  role_id?: number;
  permission_id?: number;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;

  // RolePermissions belongsTo Permissions via permission_id
  permission!: Permissions;
  getPermission!: Sequelize.BelongsToGetAssociationMixin<Permissions>;
  setPermission!: Sequelize.BelongsToSetAssociationMixin<Permissions, PermissionsId>;
  createPermission!: Sequelize.BelongsToCreateAssociationMixin<Permissions>;
  // RolePermissions belongsTo Roles via role_id
  role!: Roles;
  getRole!: Sequelize.BelongsToGetAssociationMixin<Roles>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<Roles, RolesId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<Roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof RolePermissions {
    return RolePermissions.init({
    role_permission_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      }
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'permissions',
        key: 'permission_id'
      }
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
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_permission_id" },
        ]
      },
      {
        name: "role_id_permission_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_id" },
          { name: "permission_id" },
        ]
      },
      {
        name: "permission_id",
        using: "BTREE",
        fields: [
          { name: "permission_id" },
        ]
      },
    ]
  });
  }
}
