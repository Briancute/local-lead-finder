import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import inMemoryDB from '../config/inMemoryDB.js';
import { isMongoDBConnected } from '../config/db.config.js';

/**
 * Register a new user
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Name, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Invalid password',
                message: 'Password must be at least 6 characters'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        let user;

        if (isMongoDBConnected()) {
            // Use MongoDB
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    error: 'User exists',
                    message: 'Email already registered'
                });
            }

            user = await User.create({
                name,
                email,
                password_hash,
                api_quota_used: 0,
                api_quota_limit: 1000
            });
        } else {
            // Use in-memory DB
            const existingUser = await inMemoryDB.findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    error: 'User exists',
                    message: 'Email already registered'
                });
            }

            user = await inMemoryDB.createUser({
                name,
                email,
                password_hash,
                api_quota_used: 0,
                api_quota_limit: 1000
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                apiQuotaLimit: user.api_quota_limit,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Registration failed',
            message: 'An error occurred during registration'
        });
    }
};

/**
 * Login user
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Missing credentials',
                message: 'Email and password are required'
            });
        }

        let user;

        if (isMongoDBConnected()) {
            // Use MongoDB
            user = await User.findOne({ email });
        } else {
            // Use in-memory DB
            user = await inMemoryDB.findUserByEmail(email);
        }

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Verify password
        console.log(`🔍 Attempting login for: ${email}`);
        const validPassword = await bcrypt.compare(password, user.password_hash);
        console.log(`🔐 Password valid: ${validPassword}`);

        if (!validPassword) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                apiQuotaUsed: user.api_quota_used,
                apiQuotaLimit: user.api_quota_limit,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            message: 'An error occurred during login'
        });
    }
};

/**
 * Get current user profile
 */
export const getMe = async (req, res) => {
    try {
        let user;

        if (isMongoDBConnected()) {
            // Use MongoDB
            user = await User.findById(req.user.userId).select('-password_hash');
        } else {
            // Use in-memory DB
            user = await inMemoryDB.findUserById(req.user.userId);
            if (user) {
                // Remove password_hash from response
                const { password_hash, ...userWithoutPassword } = user;
                user = userWithoutPassword;
            }
        }

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                apiQuotaUsed: user.api_quota_used,
                apiQuotaLimit: user.api_quota_limit,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            error: 'Failed to fetch user'
        });
    }
};
