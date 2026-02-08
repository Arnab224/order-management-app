const MenuItem = require("../models/MenuItem");

const getMenu = async () => {
  return await MenuItem.find();
};

const createMenuItem = async (data) => {
  return await MenuItem.create(data);
};

module.exports = {
  getMenu,
  createMenuItem
};
