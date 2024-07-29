"use strict";
require("dotenv").config({});
const Sequelize = require('sequelize');

const { Op, QueryTypes } = Sequelize;

const db = {};
let sequelize;
const config = require("../config/config.js");


const AccountModel = require("./AccountModel");
const PermissionModel = require("./PermissionModel");
const RoleModel =  require("./RoleModel");
const RolePermissionModel = require("./RolePermissionModel");
const AppModel = require("./AppModel");
const EnvModel = require("./EnvModel");

const models = {
  AccountModel,
  PermissionModel,
  RoleModel,
  RolePermissionModel,
  AppModel,
  EnvModel,
};

Object.keys(models).forEach((fileName) => {
  const file = models[fileName];

  if (!sequelize) {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
  }

  db.RawQuery = (query, opts = {}) => {
    const options = {
      raw: true,
      type: QueryTypes.SELECT,
    };
    if (opts.logging) {
      options.logging = console.log;
    }
    if (opts.plain != undefined) {
      options.plain = opts.plain;
    }
    return sequelize.query(query, options);
  };

  const model = file(sequelize, Sequelize.DataTypes);
  model.modelName = fileName;
  model.RawQuery = db[fileName] = model;
  model.isExist = (query) => {
    return model.findOne({ raw: true, where: query });
  };

  db[fileName] = model;
});

Object.keys(db).forEach((file) => {
  if (db[file].associate) {
    db[file].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
