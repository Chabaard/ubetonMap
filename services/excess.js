const Excess = require("../db/excess");
const { Op } = require("sequelize");

module.exports = {
  async getAllActiveExcesses() {
    const excesses = await Excess.findAll({
      where: {
        status: {
          [Op.or] : ["En attente","Matché", "Non matché"],
        },
      },
    });
    return excesses;
  }
};
