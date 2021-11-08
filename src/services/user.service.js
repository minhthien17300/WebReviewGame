const USER = require('../models/USERINFO.model');
const bcrypt = require('bcryptjs');
const jwtServices = require('./jwt.service');
const { defaultRoles } = require('../config/defineModel');
const { configEnv } = require('../config/config');
const nodemailer = require('nodemailer');
const { sendMail } = require('./sendMail.service');
const otpGenerator = require('otp-generator');
const { string } = require('@hapi/joi');

exports.registerUserAsync = async body => {
	try {
		const { userName, userPwd, name, email, phone, gender, dateofBirth } = body;
		//kiểm tra xem đã có email trong database chưa
		const emailExist = await USER.findOne({
			email: email
		});
		if (emailExist)
			return {
				message: 'Email đã tồn tại! Hãy đăng nhập!',
				success: false
			};
        //kiểm tra xem đã có username trong database chưa
        const userExist = await USER.findOne({
            userName: userName
        });
        if(userExist)
            return {
                message: "Tài khoản đã tồn tại! Hãy đăng nhập!",
                success: false
            }
        //mã hóa password
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
			message: 'Đăng ký thành công',
			success: true,
			data: generateToken
		};
	} catch (err) {
		console.log(err);
		return {
			error: 'Internal Server Error',
			success: false
		};
	}
};

exports.loginAsync = async body => {
	try {
		const { userName, userPwd } = body;
        const user = await USER.findOne({
			$or: [
				{userName: userName},
				{email: userName}
			]
		});
		if (!user) {
			return {
				message: 'Sai tài khoản hoặc email đăng nhập!',
				success: false
			};
		}
		const checkPassword = await bcrypt.compare(userPwd, user.userPwd);
		if (!checkPassword) {
			return {
				message: 'Sai mật khẩu!',
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
			message: 'Đăng nhập thành công!',
			success: true,
			data: generateToken
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'Oops! Có lỗi xảy ra!',
			success: false
		};
	}
};

exports.findUserByIdAsync = async (id) => {
	try {
		const user = await USER.findOne({ _id: id });
		if (!user) {
			return {
				message: 'Không tìm thấy người dùng hợp lệ!',
				success: false
			};
		}
		return {
			message: 'Tìm thành công',
			success: true,
			data: user
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'Oops! Có lỗi xảy ra!',
			success: false
		};
	}
};

exports.changePasswordAsync = async (id, body) => {
	try {
		const { oldPassword, newPassword, confirmPassword } = body;
		const user = await USER.findOne({ _id: id });
		const checkPassword = await bcrypt.compare(oldPassword, user.userPwd);
		if (!checkPassword) {
			return {
				message: 'Sai mật khẩu cũ!',
				success: false,
				data: user
			};
		}
		const checkConfirm = await String.compare(newPassword, confirmPassword);
		if(!checkConfirm){
			return {
				message: 'Nhập lại mật khẩu không khớp!',
				success: false,
				data: user
			}
		}
		const newPwd = await bcrypt.hash(newPassword, 8);
		user.userPwd = newPwd;
		await user.save();
		return {
			message: 'Đổi mật khẩu thành công!',
			success: true
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'Oops! Có lỗi xảy ra!',
			success: false
		};
	}
};
exports.fotgotPassword = async body => {
	try {
		const email = body.email;
		var otp = await otpGenerator.generate(5, {
			upperCase: false,
			specialChars: false,
			alphabets: false
		});
		const result = await USER.findOneAndUpdate({ email: email }, { otp: otp }, { new: true });
		if (result != null) {
			const mailOptions = {
				to: result.email,
				from: configEnv.Email,
				subject: 'Quên mật khẩu ReviewGame',
				text: 'Mã OTP của bạn là: ' + result.otp
			};
			const resultSendMail = await sendMail(mailOptions);
			console.log(resultSendMail);
			if (!resultSendMail) {
				return {
					message: 'Gửi mail không thành công!',
					success: false
				};
			} else {
				return {
					message: 'Gửi mail thành công!',
					success: true
				};
			}
		} else {
			return {
				message: 'Sai email đăng nhập',
				success: false
			};
		}
	} catch (error) {
		console.log(error);
		return {
			message: 'Internal Server Error',
			success: false
		};
	}
};
exports.resetPassword = async body => {
	try {
		const { email, password, confirmPassword, otp } = body;
		let user = await USER.findOne({ email: email });
		if (user != null) {
			if (password != confirmPassword) {
				return {
					message: 'Nhập lại mật khẩu không khớp!',
					success: false,
					data: user
				}
			}
			if (otp == user.otp) {
				const hashedPassword = await bcrypt.hash(password, 8);
				const otp = otpGenerator.generate(5, {
					upperCase: false,
					specialChars: false,
					alphabets: false
				});
				user.userPwd = hashedPassword;
				user.otp = otp;
				user.save();
				return {
					message: 'Đổi mật khẩu thành công!',
					success: true
				};
			} else {
				return {
					message: 'Sai mã OTP!',
					success: false
				};
			}
		} else {
			return {
				message: 'Sai email đăng nhập!',
				success: false
			};
		}
	} catch (error) {
		return {
			message: 'Oops! Có lỗi xảy ra!' + error,
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

exports._findUserByRoleAsync = async () => {
	try {
		const user = await ACCOUNT.findOne({
			role: 0
		});
		return user;
	} catch (err) {
		console.log(err);
		return null;
	}
};