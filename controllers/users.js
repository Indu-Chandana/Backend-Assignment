import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Users from '../models/users.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await Users.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials. " });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "7d" });

        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. ' });
    }
}

export const signup = async (req, res) => {

    const { firstName, lastName, email, confirmPassword, password } = req.body;


    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match " });

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await Users.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, isAdmin: false });
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({ result, token });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. ' });
    }
}

export const getAllUsers = async (req, res) => {

    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await Users.findById(id);
        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;

    const user = req.body;

    const updateUser = {
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No User with id: ${id}`);

    const newUser = await Users.findByIdAndUpdate(id, updateUser, { new: true })
    res.json(newUser);
}