import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Roles, RolesId } from './Roles';

export interface AccountsAttributes {
  account_id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  email?: string;
  token?: string;
  role_id?: number;
  last_login_date?: Date;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;
}

export type AccountsPk = "account_id";
export type AccountsId = Accounts[AccountsPk];
export type AccountsOptionalAttributes = "account_id" | "first_name" | "last_name" | "username" | "password" | "email" | "token" | "role_id" | "last_login_date" | "created_by" | "modified_by" | "is_active" | "updated_date" | "created_date";
export type AccountsCreationAttributes = Optional<AccountsAttributes, AccountsOptionalAttributes>;

export class Accounts extends Model<AccountsAttributes, AccountsCreationAttributes> implements AccountsAttributes {
  account_id!: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  email?: string;
  token?: string;
  role_id?: number;
  last_login_date?: Date;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  updated_date?: Date;
  created_date?: Date;

  // Accounts belongsTo Roles via role_id
  role!: Roles;
  getRole!: Sequelize.BelongsToGetAssociationMixin<Roles>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<Roles, RolesId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<Roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Accounts {
    return Accounts.init({
    account_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "username"
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "email"
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      }
    },
    last_login_date: {
      type: DataTypes.DATE,
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
    tableName: 'accounts',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "account_id" },
        ]
      },
      {
        name: "username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "first_name_last_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "first_name" },
          { name: "last_name" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "role_id",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  });
  }
}
