require('dotenv').config();
const configEnv = {
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
	JWT_KEY: process.env.JWT_KEY,
	MONGO_URI: process.env.MONGO_URI,
	PORT: process.env.PORT,
	Email: process.env.Email,
	Password: process.env.Password
};
const DFRoleValue = ["User", "Admin"]
const DFGenderValue = ["Male","Female", "Unknown"]
const DFStatusesValue = ["ACTIVE","BAN"]
const DFGameStatusValue = ["VeryPositive","Positive","Mixed","Negative","VeryNegative"]
module.exports = {
	configEnv,
	DFRoleValue,
	DFGenderValue,
	DFStatusesValue,
    DFGameStatusValue
};