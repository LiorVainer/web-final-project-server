import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserBody, UpdateUserBody } from '../types/user.types';

export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    try {
        const { email, password } = req.body;
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = await UserRepository.create({
            email,
            password: hashedPassword,
            username: req.body.username,
            pictureId: req.body.pictureId,
        });
        res.status(201).send(newUser);
    } catch (err) {
        res.status(500).send({ message: 'Error creating user', error: err });
    }
};

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await UserRepository.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching users', error: err });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await UserRepository.findById(userId);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching user', error: err });
    }
};

export const updateUserById = async (req: Request<Record<any, any>, {}, UpdateUserBody>, res: Response) => {
    try {
        const userId = req.params.id;
        const { email, password } = req.body;

        const user = await UserRepository.findById(userId);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        if (email) user.email = email;
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);
        }

        await user.save();
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: 'Error updating user', error: err });
    }
};

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await UserRepository.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        res.status(200).send(user);
    } catch (err) {
        res.status(500).send({ message: 'Error deleting user', error: err });
    }
};
