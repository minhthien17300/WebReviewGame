const USER = require('../models/USERINFO.model');
const jwt = require('jsonwebtoken')

exports.checkRole = (roles = [])=> async (req, res, next) => {
  const { decodeToken } = req.value.body;
  const id = decodeToken.data.id;
  const user = await USER.findById({ _id: id });
  if (user != null && user.isActived && roles.includes(user.role))
  {
    next();
    return;
  }
  res.status(401).json({
    message: 'Bạn không có quyền truy cập vào chức năng này',
    success: false
  });
};