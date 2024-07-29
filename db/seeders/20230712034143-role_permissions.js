"use strict";
const { parseCsvService } = require('../utils/index');
const path = require("path");

const tblName = "role_permissions";
const filePath = path.join(__dirname, `../seeding/${tblName}.csv`);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    let parsedCsv = await parseCsvService(filePath);
    await queryInterface.bulkInsert(tblName, parsedCsv, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(tblName, null, {});
  },
};
