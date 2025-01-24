import { ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";
import { CreateUserBody, UpdateUserBody } from "../types/user.types";

export const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      username: req.body.username,
      pictureId: req.body.pictureId,
    });
    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).send({ message: "Error creating user", error: err });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: "Error fetching users", error: err });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: "Error fetching user", error: err });
  }
};

export const updateUserById = async (
  req: Request<ParamsDictionary, {}, UpdateUserBody>,
  res: Response
) => {
  try {
    const userId = req.params.id;
    const { email, password } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: "Error updating user", error: err });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: "Error deleting user", error: err });
  }
};
