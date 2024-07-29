import type { Sequelize } from "sequelize";
import { Accounts as _Accounts } from "./Accounts";
import type { AccountsAttributes, AccountsCreationAttributes } from "./Accounts";
import { Apps as _Apps } from "./Apps";
import type { AppsAttributes, AppsCreationAttributes } from "./Apps";
import { Envs as _Envs } from "./Envs";
import type { EnvsAttributes, EnvsCreationAttributes } from "./Envs";
import { Permissions as _Permissions } from "./Permissions";
import type { PermissionsAttributes, PermissionsCreationAttributes } from "./Permissions";
import { RolePermissions as _RolePermissions } from "./RolePermissions";
import type { RolePermissionsAttributes, RolePermissionsCreationAttributes } from "./RolePermissions";
import { Roles as _Roles } from "./Roles";
import type { RolesAttributes, RolesCreationAttributes } from "./Roles";

export {
  _Accounts as Accounts,
  _Apps as Apps,
  _Envs as Envs,
  _Permissions as Permissions,
  _RolePermissions as RolePermissions,
  _Roles as Roles,
};

export type {
  AccountsAttributes,
  AccountsCreationAttributes,
  AppsAttributes,
  AppsCreationAttributes,
  EnvsAttributes,
  EnvsCreationAttributes,
  PermissionsAttributes,
  PermissionsCreationAttributes,
  RolePermissionsAttributes,
  RolePermissionsCreationAttributes,
  RolesAttributes,
  RolesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Accounts = _Accounts.initModel(sequelize);
  const Apps = _Apps.initModel(sequelize);
  const Envs = _Envs.initModel(sequelize);
  const Permissions = _Permissions.initModel(sequelize);
  const RolePermissions = _RolePermissions.initModel(sequelize);
  const Roles = _Roles.initModel(sequelize);

  Envs.belongsTo(Apps, { as: "app", foreignKey: "app_id"});
  Apps.hasMany(Envs, { as: "envs", foreignKey: "app_id"});
  RolePermissions.belongsTo(Permissions, { as: "permission", foreignKey: "permission_id"});
  Permissions.hasMany(RolePermissions, { as: "role_permissions", foreignKey: "permission_id"});
  Accounts.belongsTo(Roles, { as: "role", foreignKey: "role_id"});
  Roles.hasMany(Accounts, { as: "accounts", foreignKey: "role_id"});
  RolePermissions.belongsTo(Roles, { as: "role", foreignKey: "role_id"});
  Roles.hasMany(RolePermissions, { as: "role_permissions", foreignKey: "role_id"});

  return {
    Accounts: Accounts,
    Apps: Apps,
    Envs: Envs,
    Permissions: Permissions,
    RolePermissions: RolePermissions,
    Roles: Roles,
  };
}
