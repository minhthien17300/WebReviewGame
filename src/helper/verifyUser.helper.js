const USER = require('../models/USERINFO.model');
const { defaultRoles } = require('../config/defineModel');

exports.checkUserAsync = async (id) => {
    const user = await USER.findById({ _id: id });
    if (user != null) return true;
    else return false;
}

exports.checkAdminAsync = async (id) => {
    const user = await USER.findById({ _id: id });
    if (user.role == defaultRoles.Admin) return true;
    else return false;
}