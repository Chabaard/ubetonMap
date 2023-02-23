const db = require("./index");
const Match = require("./match");

const Need = db.define("need", {
  name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  concreteType: {
    type: String,
  },
  deliveryHours: {
    type: String,
  },
  status: {
    type: String,
    defaultValue: "En attente",
  },
  truckType: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

Need.hasMany(Match);
Match.belongsTo(Need);

module.exports = Need;
