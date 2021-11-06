const USER = require('../models/USERINFO.model');
const bcrypt = require('bcryptjs');
const jwtServices = require('./jwt.service');
const { defaultRoles } = require('../config/defineModel');
const { configEnv } = require('../config/config');
const nodemailer = require('nodemailer');
const { sendMail } = require('./sendMail.service');
const otpGenerator = require('otp-generator');

exports.registerUserAsync = async body => {
	try {
		const { userName, userPwd, name, email, phone, gender, dateofBirth } = body;
		//kiểm tra xem đã có email trong database chưa
		const emailExist = await USER.findOne({
			email: email
		});
		if (emailExist)
			return {
				message: 'Email already exists',
				success: false
			};
        //kiểm tra xem đã có username trong database chưa
        const userExist = await USER.findOne({
            userName: userName
        });
        if(userExist)
            return {
                message: "Username already exists",
                success: false
            }
        //bảo mật password
		const hashedPassword = await bcrypt.hash(userPwd, 8);
        //lưu user
		const newUser = new USER({
			userName: userName,
			userPwd: hashedPassword,
            name: name,
            email: email,
			phone: phone,
			gender: gender,
			dateofBirth: dateofBirth
		});
		await newUser.save();
		const generateToken = await jwtServices.createToken({
			id: newUser._id,
			role: newUser.role
		});
		return {
			message: 'Success Register',
			success: true,
			data: generateToken
		};
	} catch (err) {
		console.log(err);
		return {
			error: 'Internal Server',
			success: false
		};
	}
};

exports.loginAsync = async body => {
	try {
		const { account, password } = body;
        const user = await USER.findOne({
			userName: account
		} || {
            email: account
        });
		if (!user) {
			return {
				message: 'Invalid Account Info !!',
				success: false
			};
		}
		const isPasswordMatch = await bcrypt.compare(password, user.userPwd);
		if (!isPasswordMatch) {
			return {
				message: 'Invalid Password !!',
				success: false
			};
		}
		console.log(user);
		const generateToken = jwtServices.createToken({
			id: user._id,
			role: user.role
		});
		console.log(generateToken);

		return {
			message: 'Successfully login',
			success: true,
			data: generateToken
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.findUserByIdAsync = async (id) => {
	try {
		const user = await USER.findOne({ _id: id });
		if (!user) {
			return {
				message: 'Get User Fail',
				success: false
			};
		}
		return {
			message: 'Successfully Get User',
			success: true,
			data: user
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.changePasswordAsync = async (id, body) => {
	try {
		const user = await USER.findOne({ _id: id });
		const oldPassword = body.oldPassword;
		const isPasswordMatch = await bcrypt.compare(oldPassword, user.userPwd);
		if (!isPasswordMatch) {
			return {
				message: 'Wrong Old Password',
				success: false,
				data: user
			};
		}
		const newPassword = await bcrypt.hash(body.newPassword, 8);
		user.userPwd = newPassword;
		await user.save();
		return {
			message: 'Change Password Successfully',
			success: true
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.fotgotPassword = async body => {
	try {
		const email = body.email;
		var otp = await otpGenerator.generate(6, {
			upperCase: false,
			specialChars: false
		});
		const result = await USER.findOneAndUpdate({ email: email }, { otp: otp }, { new: true });
		if (result != null) {
			// var smtpTransport = nodemailer.createTransport({
			// 	service: "gmail", //smtp.gmail.com  //in place of service use host...
			// 	secure: false, //true
			// 	port: 25, //465
			// 	auth: {
			// 		user: configEnv.Email,
			// 		pass: configEnv.Password,
			// 	},
			// 	tls: {
			// 		rejectUnauthorized: false,
			// 	},
			// });
			const mailOptions = {
				to: result.email,
				from: configEnv.Email,
				subject: 'Quên mật khẩu ReviewGame',
				text: 'Mã OTP của bạn là: ' + result.otp
			};
			const resultSendMail = await sendMail(mailOptions);
			console.log(resultSendMail);
			// smtpTransport.sendMail(mailOptions, function (error, response)  {
			// 	if (error) {
			// 		console.log(error)
			// 		 return {
			// 			message: 'Send Email Failed',
			// 			success: false
			// 		};
			// 	} else {
			// 		console.log("voo nef")
			// 		 return {
			// 			message: 'Send Email Success',
			// 			success: true
			// 		};
			// 	}
			// });
			// return {
			// 	message: 'Send Email Success',
			// 	success: true
			// };
			if (!resultSendMail) {
				return {
					message: 'Send Email Failed',
					success: false
				};
			} else {
				return {
					message: 'Send Email Success',
					success: true
				};
			}
		} else {
			return {
				message: 'Wrong email',
				success: false
			};
		}
	} catch (error) {
		console.log(error);
		return {
			message: 'Internal Server',
			success: false
		};
	}
};
exports.resetPassword = async body => {
	try {
		const { otp, password, email } = body;
		let user = await USER.findOne({ email: email });
		if (user != null) {
			if (otp == user.otp) {
				const hashedPassword = await bcrypt.hash(password, 8);
				const otp = otpGenerator.generate(6, {
					upperCase: false,
					specialChars: false
				});
				user.userPwd = hashedPassword;
				user.otp = otp;
				user.save();
				return {
					message: 'Reset Password success',
					success: true
				};
			} else {
				return {
					message: 'OTP invalid',
					success: false
				};
			}
		} else {
			return {
				message: 'Wrong Email',
				success: false
			};
		}
	} catch (error) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports._findAdminByRoleAsync = async () => {
	try {
		const user = await ACCOUNT.findOne({
			role: 1
		});
		return user;
	} catch (err) {
		console.log(err);
		return null;
	}
};