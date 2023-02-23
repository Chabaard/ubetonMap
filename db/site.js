const db = require("./index");
const Need = require("./need");


const Site = db.define("site", {
  name: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  zip: {
    type: Number,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  address1: {
    type: String,
    require: true,
  },
  address2: {
    type: String,
  },
  latitude: {
    type: String,
    require: true,
  },
  longitude: {
    type: String,
  },
  infos: {
    type: String,
  },
  status:{
    type:String,
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

Site.hasMany(Need);
Need.belongsTo(Site);

module.exports = Site;
