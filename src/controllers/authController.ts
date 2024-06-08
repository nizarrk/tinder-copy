import { Request, Response } from 'express';
import { db } from '../configs/sequelize';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import response from '../tools/response';

export const login = async (req: Request, res: Response) => {
    console.log(db);
    
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(req, res, { status: 400, message: 'Validation failed', errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Check if user with provided username exists
        const user = await db.tinderCopy.User.findOne({ where: { username } });
        if (!user) {
            return response(req, res, { status: 400, message: 'Invalid credentials' });
        }

        // Compare hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return response(req, res, { status: 400, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || '',
            { expiresIn: '6h' } // Token expires in 1 hour
        );

        response(req, res, { status: 200, message: 'Login successful', data: { token: token } });
    } catch (error: any) {
        console.error('Login error:', error);
        response(req, res, { status: 500, message: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(req, res, { status: 400, message: 'Validation failed', errors: errors.array() });
    }

    const { first_name, last_name, username, email, password, gender, birthdate, location, bio } = req.body;

    try {
        // Check if user with provided email already exists
        let user = await db.tinderCopy.User.findOne({ where: { email } });
        if (user) {
            return response(req, res, { status: 400, message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user record in the database
        user = await db.tinderCopy.User.create({
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword,
            gender,
            birthdate,
            location,
            bio
        });

        response(req, res, { status: 201, message: 'User registered successfully' });
    } catch (error: any) {
        console.error('Register error:', error);
        response(req, res, { status: 500, message: error.message || 'Internal server error' });
    }
};