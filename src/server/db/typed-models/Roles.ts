import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Accounts, AccountsId } from './Accounts';
import type { RolePermissions, RolePermissionsId } from './RolePermissions';

export interface RolesAttributes {
  role_id: number;
  name?: string;
  description?: string;
  ref_name?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;
}

export type RolesPk = "role_id";
export type RolesId = Roles[RolesPk];
export type RolesOptionalAttributes = "role_id" | "name" | "description" | "ref_name" | "created_by" | "modified_by" | "is_active" | "updated_date" | "created_date";
export type RolesCreationAttributes = Optional<RolesAttributes, RolesOptionalAttributes>;

export class Roles extends Model<RolesAttributes, RolesCreationAttributes> implements RolesAttributes {
  role_id!: number;
  name?: string;
  description?: string;
  ref_name?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;

  // Roles hasMany Accounts via role_id
  accounts!: Accounts[];
  getAccounts!: Sequelize.HasManyGetAssociationsMixin<Accounts>;
  setAccounts!: Sequelize.HasManySetAssociationsMixin<Accounts, AccountsId>;
  addAccount!: Sequelize.HasManyAddAssociationMixin<Accounts, AccountsId>;
  addAccounts!: Sequelize.HasManyAddAssociationsMixin<Accounts, AccountsId>;
  createAccount!: Sequelize.HasManyCreateAssociationMixin<Accounts>;
  removeAccount!: Sequelize.HasManyRemoveAssociationMixin<Accounts, AccountsId>;
  removeAccounts!: Sequelize.HasManyRemoveAssociationsMixin<Accounts, AccountsId>;
  hasAccount!: Sequelize.HasManyHasAssociationMixin<Accounts, AccountsId>;
  hasAccounts!: Sequelize.HasManyHasAssociationsMixin<Accounts, AccountsId>;
  countAccounts!: Sequelize.HasManyCountAssociationsMixin;
  // Roles hasMany RolePermissions via role_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Roles {
    return Roles.init({
    role_id: {
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
    tableName: 'roles',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  });
  }
}
