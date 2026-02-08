const menuService = require("../services/menu.service");

const getMenu = async (req, res, next) => {
  try {
    const menu = await menuService.getMenu();
    res.json(menu);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMenu };
