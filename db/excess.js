const db = require("./index");

const Excess = db.define("excess", {
  zip: {
    type: Number,
  },
  stripePrice: {
    type: String,
  },
  stripeProduct: {
    type: String,
  },
  city: {
    type: String,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  manufactureDate: {
    type: Date,
  },
  formulation: {
    type: String,
  },
  concreteType: {
    type: Date,
  },
  truckType: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
  },
  driverPhone: {
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

module.exports = Excess;
