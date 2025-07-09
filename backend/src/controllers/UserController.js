// src/controllers/UserController.js
const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/UserModel');
require('dotenv').config();

class UserController {
    async register(req, res) {
        
        const { username, password, role, system_name, email, phone } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ username, password và role.' });
        }

        try {
            
            const existingUser = await UserRepository.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại.' });
            }

            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                password: hashedPassword, 
                role,
                system_name,
                email,
                phone,
                status: 'Active' 
            });

           
            await newUser.save();

           
            res.status(201).json({
                success: true,
                message: 'Đăng ký người dùng thành công!',
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    role: newUser.role
                }
            });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra trên máy chủ.', error: error.message });
        }
    }
    async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
        }

        try {
            const user = await UserRepository.findUserByUsername(username);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
            }

            const payload = {
                userId: user._id,
                role: user.role
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công!',
                token: `Bearer ${token}`,
                role: user.role
            });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra trên máy chủ.' });
        }
    }
}

module.exports = new UserController();