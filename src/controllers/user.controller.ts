import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserBody, UpdateUserBody } from '../types/user.types';

export const userController = {
    createUser: async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
        try {
            const { email, password } = req.body;
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
            const newUser = await UserRepository.create({
                email,
                password: hashedPassword,
                username: req.body.username,
                picture: req.body.picture,
            });
            res.status(201).send(newUser);
        } catch (err) {
            res.status(500).send({ message: 'Error creating user', error: err });
        }
    },

    getAllUsers: async (_req: Request, res: Response) => {
        try {
            const users = await UserRepository.find({});
            res.status(200).send(users);
        } catch (err) {
            res.status(500).send({ message: 'Error fetching users', error: err });
        }
    },

    getUserById: async (req: Request, res: Response) => {
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
    },

    updateUserById: async (req: Request<Record<any, any>, {}, UpdateUserBody>, res: Response) => {
        try {
            const userId = req.params.id;
            const user = await UserRepository.findById(userId);
            if (!user) {
                res.status(404).send({ message: 'User not found' });
                return;
            }

            console.log({ userId, ...req.body });
            const updatedUser = await UserRepository.findByIdAndUpdate(userId, req.body);
            console.log(updatedUser);
            res.status(200).send(updatedUser);
        } catch (err) {
            res.status(500).send({ message: 'Error updating user', error: err });
        }
    },
    deleteUserById: async (req: Request, res: Response) => {
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
    },
};
